import NotFoundView from "@/component/notFound/NotFoundView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Sabil Kids",
  description: "The page you are looking for could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundView />;
}
