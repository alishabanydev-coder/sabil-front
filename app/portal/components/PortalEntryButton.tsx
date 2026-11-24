"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, CircularProgress } from "@mui/material";

function isPortalRole(role: string | null) {
  return role === "author" || role === "accountant";
}

export default function PortalEntryButton() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsLoggedIn(Boolean(token) && isPortalRole(role));
    setReady(true);
  }, []);

  if (!ready) {
    return <CircularProgress size={28} />;
  }

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={() => router.push(isLoggedIn ? "/panel" : "/sign-in")}
      sx={{
        px: 5,
        py: 1.5,
        fontWeight: 800,
        fontSize: 16,
        textTransform: "none",
        borderRadius: 2,
        boxShadow: (theme) => `0 10px 28px ${theme.palette.primary.main}55`,
      }}
    >
      {isLoggedIn ? "Open Analytics Panel" : "Sign In to Continue"}
    </Button>
  );
}
