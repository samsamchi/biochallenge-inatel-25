"use client";

import logo from "@/assets/images/outlined.svg";
import AuthGuard from "@/components/AuthGuard";
import { Button, Tooltip } from "@heroui/react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-100">
        <div className="w-full justify-between flex items-center p-2 bg-white border-b border-gray-200">
          <div className="flex flex-row gap-2 items-center">
            <Image
              src={logo}
              className="translate-x-0.25 ml-2"
              alt="Controle de Medicamentos"
              width={36}
              height={36}
            />
            <p className="font-semibold mb-0.5 text-lg">Medicontrole</p>
          </div>
          <Tooltip content="Sair" placement="bottom">
            <Button isIconOnly onPress={() => signOut()} variant="light">
              <LogOut size={20} />
            </Button>
          </Tooltip>
        </div>
        <div className="overflow-y-auto overflow-x-hidden max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
