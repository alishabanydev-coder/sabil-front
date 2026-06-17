import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Sabeel Kids",
  description: "پنل مدیریت",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
