"use client";

import { useEffect, useState } from "react";
import AdminPanel from "@/component/admin/AdminPanel";
import LoginPanel from "@/component/admin/LoginPanel";

export default function AdminPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    setIsValid(Boolean(token) && (role === "admin" || role === "super_admin"));
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (isValid) {
    return <AdminPanel onLogout={() => setIsValid(false)} />;
  }

  return <LoginPanel setIsValid={setIsValid} />;
}
