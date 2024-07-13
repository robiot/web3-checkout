import { FC, ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const ExpandSheet: FC<{
  children: ReactNode;
  id: string;
  active: boolean;
}> = ({ children, id, active }) => {
  if (!active) {
    return <>{children}</>;
  }

  return (
    <Sheet>
      <SheetTrigger className="text-primary text-left">{children}</SheetTrigger>
      <SheetContent className="sm:max-w-[800rem]">
        <SheetHeader>
          <SheetTitle>{id}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 mt-10 pb-9 overflow-auto max-h-full">
          <div className="text-xl font-bold">Product details</div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
