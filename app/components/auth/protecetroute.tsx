"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string | string[];   // <— agora aceita UMA ou VÁRIAS
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 🔐 Se não tiver token → LOGIN imediatamente
    if (!token) {
      router.replace("/Login");
      return;
    }

    // transforma allowedRoles em array caso seja string
    const allowedArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // ❌ role não permitida → volta ou redireciona
    if (!role || !allowedArray.includes(role)) {
      setIsAuthorized(false);
      router.replace("/Login");   // sempre joga pro login
      return;
    }

    // ✔ autorizado
    setIsAuthorized(true);
  }, [allowedRoles, router]);

  if (isAuthorized === null) return <p>Carregando...</p>;

  return isAuthorized ? <>{children}</> : null;
}
