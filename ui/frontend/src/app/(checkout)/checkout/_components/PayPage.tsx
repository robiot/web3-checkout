import { FC } from "react";

import { Button } from "@/components/ui/button";

export const PayPage: FC<{ next: () => void }> = ({ next }) => {
  return (
    <>
      <div className="text-xl">Step 3. Payment</div>

      <div className="flex flex-col py-14 gap-4 w-full">
        <Button onClick={() => {}}>Pay</Button>
      </div>
    </>
  );
};
