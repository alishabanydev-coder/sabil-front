"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Alert, Box, Link, Stack, Typography } from "@mui/material";
import LoginPanel from "@/component/admin/LoginPanel";
import { clearAdminSession } from "@/component/admin/services/adminSession";

function isPortalRole(role: string | null) {
  return role === "author" || role === "accountant";
}

export default function PortalSignInPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [roleError, setRoleError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && isPortalRole(role)) {
      router.replace("/panel");
      return;
    }

    setReady(true);
  }, [router]);

  const handleSetValid = (nextValid: boolean) => {
    if (!nextValid) {
      return;
    }

    const role = localStorage.getItem("role");
    if (isPortalRole(role)) {
      setRoleError("");
      router.replace("/panel");
      return;
    }

    clearAdminSession();
    setRoleError("Please sign in with an Author or Accountant account.");
  };

  if (!ready) {
    return null;
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
          <Link component={NextLink} href="/" underline="hover">
            About this app
          </Link>{" "}
          &bull;{" "}
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
