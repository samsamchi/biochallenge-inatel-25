"use client";
import { ApiProvider } from "@/contexts/apiContext";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <ApiProvider>
        <HeroUIProvider>
          <ToastProvider />
          {children}
        </HeroUIProvider>
      </ApiProvider>
    </SessionProvider>
  );
};

export default Providers;
