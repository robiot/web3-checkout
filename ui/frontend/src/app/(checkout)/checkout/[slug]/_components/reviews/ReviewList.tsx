import Image from "next/image";
import { FC } from "react";

import { Stars } from "@/components/common/Stars";
import { useReviews } from "@/lib/useReviews";

export const ReviewList: FC<{ id: string }> = ({ id }) => {
  const reviews = useReviews(id);

  return (
    <>
      {reviews.data?.reviews.map((review, index) => (
        <div key={index} className="border-border rounded-xl border p-4">
          <div className="flex items-center justify-between gap-4">
            <Stars percent={review.score} size="sm" />
            2024
          </div>

          <p className="mt-4 text-foreground/70">{review.description}</p>

          <p className="flex items-center gap-3 mt-5">
            Verified from a real human
            <Image
              height={50}
              width={50}
              src="/verified.png"
              alt="verified"
              className="h-4 w-4 mt-1"
            />
          </p>
        </div>
      ))}
    </>
  );
};
