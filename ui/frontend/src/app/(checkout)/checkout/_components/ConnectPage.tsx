import { useWeb3Modal } from "@web3modal/wagmi/react";
import { FC } from "react";
import { useAccount, useDisconnect } from "wagmi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CLabel } from "./Label";

export const ConnectPage: FC = () => {
  const modal = useWeb3Modal();

  const account = useAccount();
  const disconnect = useDisconnect();

  return (
    <div className="flex flex-col">
      <CLabel>Wallet</CLabel>
      <div className="flex gap-5">
        <Input
          value={account.address ?? "Not connected"}
          disabled
          className="h-10"
        />
        <Button
          variant="outline"
          onClick={() => {
            if (account.isConnected) {
              disconnect.disconnect();
            } else {
              modal.open({ view: "Connect" });
            }
          }}
        >
          {account.isConnected ? <>Disconnect</> : <>Connect Wallet</>}
        </Button>
      </div>
    </div>
  );
};
