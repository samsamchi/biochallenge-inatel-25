"use client";
import { ApiProvider } from "@/contexts/apiContext";
import { qc } from "@/services/queryClient";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <ApiProvider>
        <QueryClientProvider client={qc}>
          <HeroUIProvider>
            <ToastProvider />
            {children}
          </HeroUIProvider>
        </QueryClientProvider>
      </ApiProvider>
    </SessionProvider>
  );
};

export default Providers;
