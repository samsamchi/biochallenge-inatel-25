"use client";

import { Spinner } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = false,
  redirectTo = "/login",
}: AuthGuardProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  // Only use session after component has mounted
  const { data: session, status } = useSession({
    required: false, // Don't force redirect here, we'll handle it manually
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && requireAuth && status === "unauthenticated") {
      router.push(redirectTo);
    }
  }, [status, requireAuth, redirectTo, router, hasMounted]);

  // Show loading state while checking authentication or during hydration
  if (!hasMounted || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if authentication is required but user is not authenticated
  if (requireAuth && (status === "unauthenticated" || !session)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
