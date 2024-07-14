import { Sparkles } from "lucide-react";
import { FC, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useReviews } from "@/lib/useReviews";

import { ReviewList } from "./reviews/ReviewList";

export const ReviewsModal: FC<{
  children: ReactNode;
  id: string;
}> = ({ children, id }) => {
  const reviews = useReviews(id);

  if (!reviews.data) {
    return <Spinner size="sm" className="text-foreground" />;
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[40rem]">
          <DialogHeader>
            <DialogTitle>Reviews</DialogTitle>
            <DialogDescription>
              The reviews are all verified to be from real humans that has
              purchased the product. This is made possible by Worldcoin!
            </DialogDescription>
          </DialogHeader>
          {reviews.data?.reviews.length > 0 ? (
            <>
              <div className="flex flex-col gap-4 py-4">
                {reviews.data?.summary && (
                  <div className="border-border rounded-xl border p-4">
                    <div className="flex gap-4">
                      <Sparkles />
                      AI Summary
                    </div>

                    <p className="mt-4 text-foreground/70">
                      {reviews.data?.summary}
                    </p>
                  </div>
                )}

                <span>All reviews</span>
                <ReviewList id={id} />
              </div>
            </>
          ) : (
            <>No reviews yet :/</>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
