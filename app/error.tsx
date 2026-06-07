"use client";

import ErrorView from "@/component/errors/ErrorView";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return <ErrorView error={error} reset={reset} />;
}
