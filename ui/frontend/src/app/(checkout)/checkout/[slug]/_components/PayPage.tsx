import { useMutation } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { Button } from "@/components/ui/button";
import { CheckoutABI } from "@/lib/contract_abi";
import { enviroment } from "@/lib/enviroment";
import { Erc20ABI } from "@/lib/erc20_abi";

export const PayPage: FC<{ id: string; price: number }> = ({ id, price }) => {
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
      console.log("paying");

      approveWrite.writeContract({
        address: enviroment.TOKEN_ADDRESS, //hardcoded
        abi: Erc20ABI,
        functionName: "approve",
        args: [
          enviroment.CONTRACT_ADDRESS,
          BigInt(Math.trunc(price * 1.06 * 100)) * BigInt(10_000) + BigInt(100000),
        ],
      });
    },
  });

  const payNormal = useMutation({
    mutationKey: ["pay_for", id],
    mutationFn: async () => {
      console.log("paying");

      productContractWrite.writeContract(
        {
          address: enviroment.CONTRACT_ADDRESS, //hardcoded
          abi: CheckoutABI,
          functionName: "makePayment",
          args: ["0x" + id.replaceAll(/-/g, "")],
        },
        { onSuccess: () => {} },
      );
    },
  });

  useEffect(() => {
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
    <div className="flex w-full mt-5">
      <Button
        onClick={() => {
          approve.mutate();
        }}
        disabled={isLoading}
        className="w-full"
      >
        Pay
      </Button>
    </div>
  );
};
