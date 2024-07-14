import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { z } from "zod";

import { Ero, Label } from "@/app/(app)/_components/ProductForm";
import { StarClick } from "@/components/common/Stars";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { enviroment } from "@/lib/enviroment";
import { useReviews } from "@/lib/useReviews";

const formSchema = z.object({
  score: z.number(), //1-100
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const CompleteModal: FC<{
  id: string;
  open: boolean;
}> = ({ id, open }) => {
  const reviews = useReviews(id);
  const searchParameters = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const productContractWrite = useWriteContract();

  const waitForWrite = useWaitForTransactionReceipt({
    hash: productContractWrite.data,
  });

  useEffect(() => {
    if (waitForWrite.isSuccess) {
      window.location.reload();
    }
  }, [waitForWrite.isSuccess]);

  const createReview = useMutation({
    mutationKey: ["create_review"],
    mutationFn: async (data: FormValues) => {
      // todo....
      const response = await fetch(
        `${enviroment.BACKEND_URL}/product/${id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: data.description,
            score: data.score,
          }),
        },
      );

      if (response.status !== 200) {
        alert("Error");

        return;
      }

      alert("Thanks for submitting");

      window.location.href = searchParameters.get("redirect_url") ?? "";
      // productContractWrite.writeContract({
      //   address: enviroment.CONTRACT_ADDRESS, //hardcoded
      //   abi: CheckoutABI,
      //   functionName: "addProduct",
      //   args: [
      //     "0x" + jsonData.data.id.replaceAll(/-/g, ""),
      //     "0x" + (await hashObject(jsonData.data)).toString("hex"),
      //     BigInt(_price) * BigInt(10_000),
      //     jsonData.data.limitPerHuman,
      //     account.address,
      //   ],
      // });
    },
  });

  if (!reviews.data) {
    return <Spinner size="sm" className="text-foreground" />;
  }

  return (
    <>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[30rem]">
          <DialogHeader>
            <DialogTitle>Thank you for your purchase! 🎉</DialogTitle>
            <DialogDescription>
              Please leave a review on the product and express your opinion.
            </DialogDescription>
          </DialogHeader>
          <div>
            <StarClick
              onClick={(n) => form.setValue("score", n)}
              value={form.watch("score")}
            />

            <div>
              <Label>Review</Label>
              <Input {...form.register("description")} />
              {form.formState.errors.description && (
                <Ero>{form.formState.errors.description.message}</Ero>
              )}
            </div>

            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={form.handleSubmit((values) => {
                createReview.mutate(values);
              })}
            >
              Submit
            </Button>

            <div className="border-t border-border w-full my-7" />

            <Button className="w-full" asChild>
              <Link href={searchParameters.get("redirect_url") ?? ""}>
                Continue
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
