/* eslint-disable sonarjs/no-duplicate-string */
import { useMutation } from "@tanstack/react-query";
import {
  IDKitWidget,
  ISuccessResult,
  VerificationLevel,
} from "@worldcoin/idkit";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { decodeAbiParameters, parseAbiParameters } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { Button } from "@/components/ui/button";
import { CheckoutABI } from "@/lib/contract_abi";
import { enviroment } from "@/lib/enviroment";
import { Erc20ABI } from "@/lib/erc20_abi";

import { CLabel } from "./Label";

export const PayWC: FC<{ id: string; price: number }> = ({ id, price }) => {
  const account = useAccount();

  const [wcData, setWCData] = useState<ISuccessResult | undefined>();

  const productContractWrite = useWriteContract();
  const approveWrite = useWriteContract();

  const waitForProductWrite = useWaitForTransactionReceipt({
    hash: productContractWrite.data,
  });

  const waitForApprove = useWaitForTransactionReceipt({
    hash: approveWrite.data,
  });

  const approve = useMutation({
    mutationKey: ["approve_for", id],
    mutationFn: async () => {
      approveWrite.writeContract({
        address: enviroment.TOKEN_ADDRESS, //hardcoded
        abi: Erc20ABI,
        functionName: "approve",
        args: [
          enviroment.CONTRACT_ADDRESS,
          BigInt(Math.trunc(price * 1.06 * 100)) * BigInt(10_000) +
            BigInt(100_000),
        ],
      });
    },
  });

  const payNormal = useMutation({
    mutationKey: ["pay_for", id],
    mutationFn: async () => {
      if (!wcData) {
        return;
      }

      console.log(
        "paying",
        wcData.proof
          .slice(2)
          .match(/.{1,64}/g)
          ?.map((it) => "0x" + it),
        decodeAbiParameters(
          parseAbiParameters("uint256[8]"),
          wcData.proof as `0x${string}`,
        )[0],
      );

      productContractWrite.writeContract(
        {
          address: enviroment.CONTRACT_ADDRESS, //hardcoded
          abi: CheckoutABI,
          functionName: "makePaymentWorldId",
          args: [
            "0x" + id.replaceAll(/-/g, ""),
            account.address!,
            wcData.merkle_root,
            wcData.nullifier_hash,
            decodeAbiParameters(
              parseAbiParameters("uint256[8]"),
              wcData.proof as `0x${string}`,
            )[0],
          ],
        },
        { onError: console.log },
      );
    },
  });

  useEffect(() => {
    console.log({ a: waitForApprove.isSuccess });

    if (waitForApprove.isSuccess) {
      payNormal.mutate();
    }
  }, [waitForApprove.isSuccess]);

  useEffect(() => {
    if (waitForProductWrite.isSuccess) {
      // do stuff
      alert("Paid yipiieeeee!!");
    }
  }, [waitForProductWrite.isSuccess]);

  const isLoading =
    approve.isPending ||
    payNormal.isPending ||
    (approve.isSuccess && waitForApprove.isPending) ||
    (payNormal.isSuccess && waitForProductWrite.isPending);

  return (
    <>
      <div className="flex flex-col">
        <CLabel>Verify that you are a human *</CLabel>
        <IDKitWidget
          action="pay"
          // signal="my_signal"
          app_id={enviroment.WI_APP_ID}
          onSuccess={(result) => {
            setWCData(result);
          }}
          verification_level={VerificationLevel.Orb}
          handleVerify={(_result) => {
            console.log(
              "you verified!!@",
              _result,
              decodeAbiParameters(
                parseAbiParameters("uint256[8]"),
                _result.proof as `0x${string}`,
              )[0],
            );
          }}
        >
          {({ open }) => (
            <Button
              variant="outline"
              onClick={open}
              className="flex gap-4 w-full"
              disabled={wcData !== undefined || !account.address}
            >
              <Image
                alt="Worldcoin"
                src="/wc.svg"
                width={20}
                height={20}
                className=""
              />
              Verify with World ID {wcData !== undefined && "✅"}
            </Button>
          )}
        </IDKitWidget>
      </div>

      <div className="flex w-full mt-5">
        <Button
          onClick={() => {
            payNormal.mutate();
          }}
          disabled={wcData == undefined || isLoading || !account.address}
          className="w-full"
        >
          Pay
        </Button>
      </div>

      <p className="text-xs text-foreground/80">
        This product can only be purchased limited amount of times per person.
      </p>
    </>
  );
};
