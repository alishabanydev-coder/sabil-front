import type { Metadata } from "next";
import {
  Box,
  Container,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PortalEntryButton from "./components/PortalEntryButton";

export const metadata: Metadata = {
  title: "Sabeel Creator Analytics",
  description:
    "Sabeel Creator Analytics is a read-only YouTube performance portal for authorized creators and Sabeel specialists. Connect a channel, review metrics, and export Excel or Sheet reports.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PortalLandingPage() {
  return (
    <Box
      dir="ltr"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        py: { xs: 4, md: 7 },
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack spacing={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 28, md: 36 },
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "primary.main",
                }}
              >
                Sabeel Creator Analytics
              </Typography>
              <Typography
                variant="h6"
                component="p"
                sx={{ mt: 1.5, fontWeight: 600, color: "text.primary" }}
              >
                Read-only YouTube performance reporting for creators and
                authorized Sabeel specialists
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1.5, maxWidth: 640, mx: "auto" }}
              >
                This portal helps independent content creators review channel
                performance and lets designated Sabeel analytics and accounting
                specialists compile the same authorized reports for analysis —
                never to sell data or change your YouTube channel.
              </Typography>
            </Box>

            <Stack sx={{ alignItems: "center", py: 1 }}>
              <PortalEntryButton />
            </Stack>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                What this app is
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Sabeel Creator Analytics</strong> is a private web
                application at <strong>analytics.sabeelgroup.org</strong>. It is
                not a consumer video site and not a public app store listing. It
                is an internal creator-reporting tool operated by Sabeel Group
                for channel owners who choose to connect their YouTube account
                and for specialists they authorize to review those reports.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Purpose of the app
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
                Our purpose is straightforward: give creators and Sabeel
                specialists a clear, read-only view of official YouTube
                performance metrics so they can analyze results, reconcile
                accounting figures, and export summaries.
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, color: "text.secondary" }}>
                <li>
                  <Typography variant="body1" color="text.secondary">
                    Connect a YouTube channel with Google OAuth (read-only
                    scopes only).
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" color="text.secondary">
                    View metrics such as views, watch time, subscribers,
                    impressions, CTR, and estimated revenue when available.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" color="text.secondary">
                    Export reports to Excel or a restricted internal Google
                    Sheet for analysis.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" color="text.secondary">
                    Disconnect or revoke access at any time from the Portal or
                    Google Account permissions.
                  </Typography>
                </li>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                What this app does not do
              </Typography>
              <Typography variant="body1" color="text.secondary">
                The Portal cannot upload, edit, or delete YouTube videos, post
                comments, or change channel settings. We do not sell channel
                data, use it for advertising, or share it with other creators.
                Sabeel Creator Analytics does <strong>not</strong> use Google
                APIs to create, distribute, or facilitate AI-generated
                non-consensual intimate imagery (AI NCII), and that is not part
                of this application&apos;s purpose or functionality.
              </Typography>
            </Box>

            <Divider />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Questions:{" "}
                <Link href="mailto:alishabanydev@gmail.com">
                  alishabanydev@gmail.com
                </Link>
              </Typography>
              <Stack direction="row" spacing={2}>
                <Link href="/privacy" underline="hover">
                  Privacy Policy
                </Link>
                <Link href="/terms" underline="hover">
                  Terms of Service
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
