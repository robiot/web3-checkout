import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import Image from "next/image";
import { FC } from "react";

import { Button } from "@/components/ui/button";
import { enviroment } from "@/lib/enviroment";

import { CLabel } from "./Label";

export const VerifyPage: FC = () => {
  return (
    <div className="flex flex-col">
      <CLabel>Verify that you are a human *</CLabel>
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
            variant="outline"
            onClick={open}
            className="flex gap-4 w-full"
            //   disabled={!account.isConnected}
          >
            <Image
              alt="Worldcoin"
              src="/wc.svg"
              width={20}
              height={20}
              className=""
            />
            Verify with World ID
          </Button>
        )}
      </IDKitWidget>
    </div>
  );
};
