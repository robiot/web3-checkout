import { FC, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ReviewsModal: FC<{
  children: ReactNode;
}> = ({ children }) => {
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
          <div className="grid gap-4 py-4">
            <div>{/* todo AI */}</div>
          </div>
          {/* <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </>
  );
};
