"use client";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <HeroUIProvider>
        <ToastProvider />
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
};

export default Providers;
