import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabeel Creator Analytics",
  description:
    "Creator and specialist analytics portal for tracking authorized channel performance.",
  openGraph: {
    title: "Sabeel Creator Analytics",
    description:
      "Creator and specialist analytics portal for tracking authorized channel performance.",
    siteName: "Sabeel Creator Analytics",
    type: "website",
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
