import Footer from "@/component/layout/Footer";
import Navbar from "@/component/layout/Navbar";
import type { Metadata } from "next";

const SITE_URL = "https://sabeelkids.com";

export const metadata: Metadata = {
  title: "Sabeel Kids | Islamic Kids Streaming and Learning",
  description:
    "Sabeel Kids offers safe and joyful Islamic content for children, including videos, stories, projects, and family-focused educational updates.",
  keywords: [
    "Sabeel Kids",
    "Islamic kids content",
    "kids streaming",
    "children learning",
    "family-friendly videos",
  ],
  openGraph: {
    title: "Sabeel Kids | Islamic Kids Streaming and Learning",
    description:
      "Safe and joyful Islamic entertainment for children with videos, projects, and educational stories.",
    url: SITE_URL,
    siteName: "Sabeel Kids",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sabeel Kids | Islamic Kids Streaming and Learning",
    description:
      "Explore family-friendly Islamic videos, projects, and educational stories for children.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
