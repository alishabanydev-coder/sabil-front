import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "./ThemeContext";
import MUIThemeProvider from "./MUIThemeProvider";
import { fetchPublicSocialMediaLinks } from "@/component/admin/services/socialMediaApi";

const SITE_URL = "https://sabilkids.com";

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
    url: SITE_URL,
    siteName: "Sabil Kids",
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let socialMediaLinks = [];
  try {
    const socialMediaResult = await fetchPublicSocialMediaLinks();
    socialMediaLinks = socialMediaResult.ok ? socialMediaResult.socialMediaLinks : [];
  } catch {
    socialMediaLinks = [];
  }

  const sameAs = socialMediaLinks
    .map((item) => (typeof item?.url === "string" ? item.url.trim() : ""))
    .filter((url) => /^https?:\/\//i.test(url));
    
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Sabil Kids",
        url: SITE_URL,
        sameAs,
      },
      {
        "@type": "WebSite",
        name: "Sabil Kids",
        url: SITE_URL,
      },
    ],
  };

  return (
    <html lang="fa" dir="rtl">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ThemeProvider>
          <MUIThemeProvider>
            {children}
          </MUIThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
