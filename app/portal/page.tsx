"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Alert, Box, Link, Stack, Typography } from "@mui/material";
import AdminPanel from "@/component/admin/AdminPanel";
import LoginPanel from "@/component/admin/LoginPanel";
import { clearAdminSession } from "@/component/admin/services/adminSession";

function isPortalRole(role: string | null) {
  return role === "author" || role === "accountant";
}

export default function PortalPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [roleError, setRoleError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    setIsValid(Boolean(token) && isPortalRole(role));
    setIsMounted(true);
  }, []);

  const handleSetValid = (nextValid: boolean) => {
    if (!nextValid) {
      setIsValid(false);
      return;
    }

    const role = localStorage.getItem("role");
    if (isPortalRole(role)) {
      setRoleError("");
      setIsValid(true);
      return;
    }

    clearAdminSession();
    setIsValid(false);
    setRoleError("Please sign in with an Author or Accountant account.");
  };

  if (!isMounted) {
    return null;
  }

  if (isValid) {
    return <AdminPanel onLogout={() => setIsValid(false)} />;
  }

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {roleError ? (
        <Box
          dir="ltr"
          sx={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            width: { xs: "92%", sm: "auto" },
            maxWidth: 480,
          }}
        >
          <Alert severity="warning" onClose={() => setRoleError("")}>
            {roleError}
          </Alert>
        </Box>
      ) : null}

      <LoginPanel setIsValid={handleSetValid} />

      <Stack
        component="footer"
        dir="ltr"
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          bottom: 14,
          left: 0,
          right: 0,
          zIndex: 10,
          px: 2,
          py: 0.75,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            bgcolor: "background.paper",
            px: 2,
            py: 0.5,
            borderRadius: 99,
            boxShadow: 1,
          }}
        >
          Sabeel Creator Analytics &bull;{" "}
          <Link component={NextLink} href="/privacy" underline="hover">
            Privacy Policy
          </Link>{" "}
          &bull;{" "}
          <Link component={NextLink} href="/terms" underline="hover">
            Terms of Service
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}
