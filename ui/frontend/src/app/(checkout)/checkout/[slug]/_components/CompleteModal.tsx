import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { StarClick } from "@/components/common/Stars";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
            {form.watch("score")}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
