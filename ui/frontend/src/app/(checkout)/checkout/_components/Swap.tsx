import { useWeb3Modal } from "@web3modal/wagmi/react";
import { FC } from "react";

export const Swap: FC = () => {
  const modal = useWeb3Modal();

  return (
    <>
      <button
        className="border-border border p-4 text-sm"
        onClick={() => {
          modal.open({ view: "Account" });
        }}
      >
        Don't have USDC?
      </button>
    </>
  );
};
