import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "./ThemeContext";
import MUIThemeProvider from "./MUIThemeProvider";
import { fetchPublicSocialMediaLinks } from "@/component/admin/services/socialMediaApi";

const SITE_URL = "https://sabeelkids.com";

export const metadata: Metadata = {
  title: "Sabeel Kids | Joyful Islamic Streaming for Children",
  description:
    "Sabeel Kids is a streaming platform for children featuring Sabeel Group animations, blogs, and project breakdowns. We create high-quality content in an Islamic atmosphere to teach values through joyful entertainment.",
  keywords: [
    "Sabeel Kids",
    "kids streaming",
    "Islamic kids content",
    "Sabeel animations",
    "children series",
    "Islamic values",
    "kids entertainment",
    "project breakdowns",
    "kids blog",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo32.webp", sizes: "32x32", type: "image/webp" },
      { url: "/logo16.webp", sizes: "16x16", type: "image/webp" },
    ],
    apple: "/icon-192.webp",
  },
    authors: [{ name: "Sabeel Group", url: "https://sabeelkids.com" }],
  creator: "Sabeel Group",
  publisher: "Sabeel Kids",
  openGraph: {
    title: "Sabeel Kids | Joyful Islamic Streaming for Children",
    description:
      "Watch Sabeel Group animations, read blogs and behind-the-scenes breakdowns, and help children learn Islamic values through joyful and meaningful stories.",
    url: SITE_URL,
    siteName: "Sabeel Kids",
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
        name: "Sabeel Kids",
        url: SITE_URL,
        sameAs,
      },
      {
        "@type": "WebSite",
        name: "Sabeel Kids",
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
