import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function AppRouteLoading() {
  return (
    <Stack
      sx={{
        direction: "ltr",
        position: "fixed",
        inset: 0,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        bgcolor: "rgba(8, 3, 20, 0.92)",
        color: "#fff",
        "& .loader": {
          width: 110,
          height: 110,
          background: "linear-gradient(-45deg, #fff 0%, #fff 100% )",
          borderRadius: 3,
          animation: "spin 3s linear infinite",
        },

        "& .loader::before": {
          content: '""',
          zIndex: -1,
          position: "absolute",
          inset: 0,
          background: "linear-gradient(-45deg, #fc00ff 0%, #00dbde 100% )",
          transform: "translate3d(0, 0, 0) scale(0.95)",
          filter: "blur(20px)",
        },

        "@keyframes spin": {
          "0%": {
            transform: "rotate(0deg)",
            scale: 0.9,
          },

          "50%": {
            transform: "rotate(-360deg)",
            borderRadius: "50%",
          },

          "100%": {
            transform: "rotate(0deg)",
            scale: 0.9,
          },
        },
      }}
    >
      <Box className="loader" />
      <Stack
        sx={{
          width: 80,
          height: 90,
          animation: "resize 3s linear infinite",
          position: "absolute",
          top: 0,
          left: 0,
          right: 5,
          bottom: 25,
          margin: "auto",
          "@keyframes resize": {
            "0%": {
              scale: 1,
            },

            "50%": {
              scale: 1.2,
            },

            "100%": {
              scale: 1,
            },
          },
        }}
      >
        <Image
          src="/icon-192.png"
          alt="logo"
          fill
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 5,
            bottom: 25,
          }}
        />
      </Stack>
      <Typography
        sx={{
          fontFamily: "Namecat",
          letterSpacing: 1.1,
          fontSize: 13,
          color: "rgba(255,255,255,0.9)",
          textTransform: "uppercase",
        }}
      >
        Preparing app mode...
      </Typography>
    </Stack>
  );
}
