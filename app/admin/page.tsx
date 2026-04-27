"use client";

import { useState } from "react";
import AdminPanel from "@/component/admin/AdminPanel";
import LoginPanel from "@/component/admin/LoginPanel";

export default function AdminPage() {
  const [isValid, setIsValid] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return Boolean(token) && (role === "admin" || role === "super_admin");
  });

  if (isValid) {
    return <AdminPanel onLogout={() => setIsValid(false)} />;
  }

  return <LoginPanel setIsValid={setIsValid} />;
}
