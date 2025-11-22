"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: "admin";
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    console.log(role)

    if (role && allowedRoles.includes(role)) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      router.back(); // 🔙 volta para a tela anterior
    }
  }, [allowedRoles, router]);

  if (isAuthorized === null) {
    return <p>Carregando...</p>;
  }

  return isAuthorized ? <>{children}</> : null;
}