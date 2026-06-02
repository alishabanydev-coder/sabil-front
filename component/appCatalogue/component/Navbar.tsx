"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [showFloatingLogout, setShowFloatingLogout] = useState(false);

  const handleLogout = () => {
    router.push("/");
  };

  useEffect(() => {
    const onScroll = () => {
      setShowFloatingLogout(window.scrollY > 80);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 4 },
        }}
      >
        <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
          <Image
            src="/icon-512.png"
            alt="Project Title"
            width={56}
            height={56}
          />
          <Typography
            sx={{
              fontSize: { xs: 24, md: 32 },
              fontWeight: 700,
              fontFamily: "Bhel Puri",
              textTransform: "uppercase",
              color: "primary.main",
            }}
          >
            Sabeel Kids
          </Typography>
        </Stack>
        <Button
          onClick={handleLogout}
          variant="contained"
          color="primary"
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Stack>

      {showFloatingLogout && (
        <Stack
          sx={{
            position: "fixed",
            top: { xs: 38, md: 48 },
            right: { xs: 12, md: 24 },
            zIndex: 60,
          }}
        >
          <IconButton
            onClick={handleLogout}
            color="primary"
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              bgcolor: "background.paper",
              backdropFilter: "blur(8px)",
              boxShadow: (theme) =>
                `0 8px 22px -10px ${theme.palette.primary.main}`,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "background.paper",
                boxShadow: (theme) =>
                  `0 8px 22px -6px ${theme.palette.primary.main}`,
              },
            }}
            aria-label="logout"
          >
            <LogoutIcon />
          </IconButton>
        </Stack>
      )}
    </>
  );
};

export default Navbar;
