"use client";

import { FC, ReactNode } from "react";

const client = new QueryClient();

import { config, projectId } from "@/lib/WagmiConfig";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
});

export const ClientProviders: FC<{
  children: ReactNode;
  initialState?: State;
}> = ({ children, initialState }) => {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};