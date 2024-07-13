import { useWeb3Modal } from "@web3modal/wagmi/react";
import { FC } from "react";
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";

export const ConnectPage: FC<{ next: () => void }> = ({ next }) => {
  const modal = useWeb3Modal();

  const account = useAccount();

  return (
    <>
      <div className="text-xl">Step 1. Connect wallet</div>

      <div className="flex flex-col py-14 gap-4">
        {!account.isConnected && (
          <Button
            onClick={() => {
              modal.open({ view: "Connect" });
            }}
          >
            <>Connect Wallet</>
          </Button>
        )}

        {account.isConnected && <w3m-button />}

        <Button
          variant="outline"
          onClick={() => {
            next();
          }}
          disabled={!account.isConnected}
        >
          Continue
        </Button>
      </div>
    </>
  );
};
