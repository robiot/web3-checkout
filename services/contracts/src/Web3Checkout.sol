// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
import {IERC20} from "./interfaces/IErc20.sol";

struct ProductMetadata {
    bytes32 h;
    uint256 price;
    uint256 purchase_limit;
    address payee;
    address controller;
}

struct Review {
    bytes32 h;
}

contract Web3Checkout {
    using ByteHasher for bytes;

    address internal immutable owner;
    uint256 internal immutable fee_percent;
    IERC20 token;

    mapping(bytes32 => ProductMetadata) internal products;
    mapping(bytes32 => Review) internal reviews;
    mapping(address => mapping(bytes32 => uint256)) internal purchase_counts;

    error DuplicateNullifier(uint256 nullifierHash);

    IWorldID internal immutable worldId;
    uint256 internal immutable externalNullifier;
    uint256 internal immutable groupId = 1;

    mapping(uint256 => bool) internal nullifierHashes;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(
        address controller,
        uint256 fee,
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId,
        IERC20 _token
    ) {
        owner = controller;
        fee_percent = fee;
        worldId = _worldId;
        externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
        token = _token;
    }

    function addProduct(bytes32 h, uint256 price, uint256 purchase_limit, address payee) public {
        products[h] = ProductMetadata(h, price, purchase_limit, payee, msg.sender);
    }

    function removeProduct(bytes32 h) public {
        require(products[h].controller == msg.sender);

        delete products[h];
    }

    function updateProduct(bytes32 h, uint256 price, uint256 purchase_limit, address payee, bytes32 new_h) public {
        // ensures controller is msg.sender
        removeProduct(h);
        addProduct(new_h, price, purchase_limit, payee);
    }

    function payout(address payable addr) public onlyOwner {
        token.transfer(addr, token.balanceOf(address(this)));
    }

    function makePayment(bytes32 h) public payable {
        ProductMetadata memory meta = products[h];

        require(meta.purchase_limit == 0);

        uint256 our_fee = meta.price * (fee_percent * 100) / 10_000;
        uint256 to_pay = meta.price + our_fee;
        require(msg.value >= to_pay);

        ++purchase_counts[msg.sender][meta.h];

        token.transferFrom(msg.sender, meta.payee, meta.price);
        token.transferFrom(msg.sender, address(this), msg.value - meta.price);
    }

    function makePaymentWorldId(
        bytes32 h,
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public payable {
        if (nullifierHashes[nullifierHash]) revert DuplicateNullifier(nullifierHash);

        worldId.verifyProof(root, groupId, abi.encodePacked(h).hashToField(), nullifierHash, externalNullifier, proof);

        nullifierHashes[nullifierHash] = true;

        ProductMetadata memory meta = products[h];
        uint256 sender_limit = purchase_counts[msg.sender][meta.h];

        require(meta.purchase_limit > 0 && sender_limit < meta.purchase_limit);

        uint256 our_fee = meta.price * (fee_percent * 100) / 10_000;
        uint256 to_pay = meta.price + our_fee;
        require(msg.value >= to_pay);

        ++purchase_counts[signal][meta.h];

        token.transferFrom(msg.sender, meta.payee, meta.price);
        token.transferFrom(msg.sender, address(this), msg.value - meta.price);
    }
}
