import { Suspense } from "react";
import SignInPage from "@/component/auth/SignInPage";
import { CircularProgress, Stack } from "@mui/material";

function SignInFallback() {
  return (
    <Stack
      sx={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <CircularProgress />
    </Stack>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInPage />
    </Suspense>
  );
}
