import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { Sparkles } from "lucide-react";
import { FC } from "react";

import { Button } from "@/components/ui/button";
import { enviroment } from "@/lib/enviroment";

export const VerifyPage: FC<{ next: () => void }> = ({ next }) => {
  return (
    <>
      <div className="text-xl">Step 2. World ID</div>

      <div className="text-sm text-foreground/80 mt-4">
        This product requires you to be a real human.
      </div>

      <div className="flex flex-col py-14 gap-4 w-full">
        <IDKitWidget
          action="report"
          // signal="my_signal"
          app_id={enviroment.WI_APP_ID}
          onSuccess={(_result) => {
            // todo antony
            // setIsVerified(true);
            // setIDData(result);
          }}
          verification_level={VerificationLevel.Orb}
          handleVerify={(_result) => {
            console.log("you verified!!@");
          }}
        >
          {({ open }) => (
            <Button
              onClick={open}
              className="gap-3 w-full bg-black hover:bg-black/80"
              size="lg"
            >
              <Sparkles />
              Verify with World ID
            </Button>
          )}
        </IDKitWidget>
        <Button
          variant="outline"
          onClick={() => {
            next();
          }}
          //   disabled={!account.isConnected}
        >
          Continue
        </Button>
      </div>
    </>
  );
};
