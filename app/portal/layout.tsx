import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sabeel Creator Analytics",
  description:
    "Sabeel Creator Analytics is a read-only YouTube performance portal for authorized creators and Sabeel specialists. Connect a channel, review metrics, and export Excel or Sheet reports.",
  openGraph: {
    title: "Sabeel Creator Analytics",
    description:
      "Read-only YouTube performance reporting for creators and authorized Sabeel specialists.",
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
