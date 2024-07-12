"use client";

import { FC, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

export const ClientProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
