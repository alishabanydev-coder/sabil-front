import Navbar from "@/component/appCatalogue/component/Navbar";
import { Stack } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabil Kids Catalogue App",
  description:
    "App-style landscape catalogue experience for Sabil Kids with horizontal movie rails.",
};

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack
      sx={{
        minHeight: "100vh",
        width: "100%",
        direction: "ltr",
        px: { xs: 2, md: 0 },
        py: { xs: 1, md: 2 },
      }}
    >
      <Navbar />
      {children}
    </Stack>
  );
}
