"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPanel from "@/component/admin/AdminPanel";
import { clearAdminSession } from "@/component/admin/services/adminSession";

function isPortalRole(role: string | null) {
  return role === "author" || role === "accountant";
}

export default function PortalPanelPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const ok = Boolean(token) && isPortalRole(role);

    if (!ok) {
      clearAdminSession();
      router.replace("/sign-in");
      return;
    }

    setIsValid(true);
    setReady(true);
  }, [router]);

  const handleLogout = () => {
    clearAdminSession();
    setIsValid(false);
    router.replace("/sign-in");
  };

  if (!ready || !isValid) {
    return null;
  }

  return <AdminPanel onLogout={handleLogout} />;
}
