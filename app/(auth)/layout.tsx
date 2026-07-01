import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | Sabeel Kids",
  description: "Sign in or create an account on Sabeel Kids.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
