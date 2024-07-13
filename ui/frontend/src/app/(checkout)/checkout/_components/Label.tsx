import { FC, ReactNode } from "react";

export const CLabel: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="text-sm font-medium mt-5 mb-2 text-foreground/80">
      {children}
    </div>
  );
};
