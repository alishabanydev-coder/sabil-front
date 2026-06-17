import AppShellStack from "@/component/capacitor/AppShellStack";
import CapacitorShell from "@/component/capacitor/CapacitorShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabeel Kids Catalogue App",
  description:
    "App-style landscape catalogue experience for Sabeel Kids with horizontal movie rails.",
};

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShellStack>
      <CapacitorShell>{children}</CapacitorShell>
    </AppShellStack>
  );
}
