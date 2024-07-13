// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
import {IERC20} from "./interfaces/IErc20.sol";

struct ProductMetadata {
    bytes16 id;
    bytes32 h;
    uint256 price;
    uint256 purchase_limit;
    address payee;
    address controller;
}

struct Review {
    bytes16 id;
    bytes32 h;
    bytes16 product_id;
}

contract Web3Checkout {
    using ByteHasher for bytes;

    address internal immutable owner;
    uint256 internal immutable fee_percent;
    IERC20 internal immutable token;

    mapping(bytes16 => ProductMetadata) internal products;
    mapping(bytes16 => Review) internal reviews;
    mapping(address => mapping(bytes16 => uint256)) internal purchase_counts_addr;
    mapping(uint256 => mapping(bytes16 => uint256)) internal purchase_counts_worldid;
    mapping(uint256 => mapping(bytes16 => bool)) internal reviews_submitted;

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

    function hashOf(bytes16 id) public view returns (bytes32) {
        return products[id].h;
    }

    function hashOfReview(bytes16 id) public view returns (bytes32) {
        return reviews[id].h;
    }

    function addProduct(bytes16 id, bytes32 h, uint256 price, uint256 purchase_limit, address payee) public {
        require(products[id].h == 0x0);
        products[id] = ProductMetadata(id, h, price, purchase_limit, payee, msg.sender);
    }

    function removeProduct(bytes16 id) public {
        require(products[id].controller == msg.sender);

        delete products[id];
    }

    function updateProduct(bytes16 id, uint256 price, uint256 purchase_limit, address payee, bytes32 new_h) public {
        // ensures controller is msg.sender
        removeProduct(id);
        addProduct(id, new_h, price, purchase_limit, payee);
    }

    function payout(address payable addr) public onlyOwner {
        token.transfer(addr, token.balanceOf(address(this)));
    }

    function makePayment(bytes16 id) public payable {
        ProductMetadata memory meta = products[id];
        require(meta.h != 0x0);

        require(meta.purchase_limit == 0);

        uint256 our_fee = meta.price * (fee_percent * 100) / 10_000;

        ++purchase_counts_addr[msg.sender][id];

        token.transferFrom(msg.sender, address(this), meta.price + our_fee);
        token.transfer(meta.payee, meta.price);
    }

    function makePaymentWorldId(
        bytes16 id,
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public payable {
        worldId.verifyProof(
            root, groupId, abi.encodePacked(signal).hashToField(), nullifierHash, externalNullifier, proof
        );

        ProductMetadata memory meta = products[id];
        require(meta.h != 0x0);

        uint256 sender_limit = purchase_counts_addr[msg.sender][id] + purchase_counts_worldid[nullifierHash][id];

        require(meta.purchase_limit > 0 && sender_limit < meta.purchase_limit);

        uint256 our_fee = meta.price * (fee_percent * 100) / 10_000;
        
        ++purchase_counts_worldid[nullifierHash][id];

        token.transferFrom(msg.sender, address(this), meta.price + our_fee);
        token.transfer(meta.payee, meta.price);
    }

    function submitReview(
        bytes16 product_id,
        bytes16 id,
        bytes32 h, 
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        worldId.verifyProof(
            root, groupId, abi.encodePacked(signal).hashToField(), nullifierHash, externalNullifier, proof
        );

        ProductMetadata memory meta = products[product_id];
        require(meta.h != 0x0);

        require(reviews_submitted[nullifierHash][meta.id] == false);

        uint256 sender_purchases = purchase_counts_addr[msg.sender][product_id] + purchase_counts_worldid[nullifierHash][product_id];
        require(sender_purchases > 0);

        reviews_submitted[nullifierHash][meta.id] = true;
        reviews[id] = Review(id, h, product_id);
    }
}
