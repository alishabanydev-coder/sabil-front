import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "./ThemeContext";
import MUIThemeProvider from "./MUIThemeProvider";
import ClientLayoutWrapper from "@/component/layoutWrapper/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Sabil Kids | Joyful Islamic Streaming for Children",
  description:
    "Sabil Kids is a streaming platform for children featuring Sabil Group animations, blogs, and project breakdowns. We create high-quality content in an Islamic atmosphere to teach values through joyful entertainment.",
  keywords: [
    "Sabil Kids",
    "kids streaming",
    "Islamic kids content",
    "Sabil animations",
    "children series",
    "Islamic values",
    "kids entertainment",
    "project breakdowns",
    "kids blog",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/icon-192.png",
  },
  authors: [{ name: "Sabil Group", url: "https://sabilkids.com" }],
  creator: "Sabil Group",
  publisher: "Sabil Kids",
  openGraph: {
    title: "Sabil Kids | Joyful Islamic Streaming for Children",
    description:
      "Watch Sabil Group animations, read blogs and behind-the-scenes breakdowns, and help children learn Islamic values through joyful and meaningful stories.",
    url: "https://sabilkids.com",
    siteName: "Sabil Kids",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <ThemeProvider>
          <MUIThemeProvider>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </MUIThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
