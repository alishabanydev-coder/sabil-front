import type { Metadata } from "next";
import NextLink from "next/link";
import { Box, Container, Divider, Link, Paper, Stack, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Terms of Service | Sabeel Creator Analytics",
  description:
    "Terms of Service for creators and authorized analytics specialists using Sabeel Creator Analytics.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PortalTermsPage() {
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
            <Box>
              <Typography variant="overline" color="primary" fontWeight={700}>
                Sabeel Creator Analytics
              </Typography>
              <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
                Terms of Service
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Effective Date: November 22, 2026
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                1. Acceptance of Terms
              </Typography>
              <Typography variant="body1">
                By accessing or signing in to Sabeel Creator Analytics at{" "}
                <strong>analytics.sabeelgroup.org</strong> (&ldquo;the Portal&rdquo;), or by
                connecting a YouTube channel via Google OAuth 2.0, you agree to these Terms of
                Service, our{" "}
                <Link component={NextLink} href="/privacy">
                  Privacy Policy
                </Link>
                , and the{" "}
                <Link
                  href="https://www.youtube.com/t/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube Terms of Service
                </Link>
                .
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                2. Purpose of the Service &amp; Read-Only Scope
              </Typography>
              <Typography variant="body1">
                The Portal provides read-only channel analytics reporting and accounting
                summaries for authorized content creators (&ldquo;Authors&rdquo;) and designated
                internal analytics specialists (&ldquo;Accountants&rdquo;). The Portal requests
                read-only Google OAuth scopes and never modifies, uploads, or deletes content on
                your YouTube channel.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                3. Creator Authorization &amp; Account Responsibilities
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, "& li": { mb: 1 } }}>
                <li>
                  <Typography variant="body1">
                    You represent that you are an authorized owner or manager of any YouTube
                    channel you connect to the Portal.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    By connecting your channel, you authorize Sabeel Group&rsquo;s designated
                    internal analytics and accounting specialists to view and export your
                    channel&rsquo;s performance metrics solely for reporting, reconciliation,
                    and performance analysis on your behalf.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    You are responsible for keeping your Portal sign-in credentials confidential
                    and notifying us promptly of any unauthorized access.
                  </Typography>
                </li>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                4. Disconnecting &amp; Termination
              </Typography>
              <Typography variant="body1">
                You may stop using the Portal and disconnect your YouTube channel at any time
                from within the Portal dashboard or via{" "}
                <Link
                  href="https://security.google.com/settings/security/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Security Settings
                </Link>
                . Sabeel Group may suspend or revoke Portal login access if an account violates
                these Terms or applicable platform policies.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                5. Disclaimer &amp; Contact
              </Typography>
              <Typography variant="body1">
                Analytics figures displayed in the Portal are retrieved directly from official
                YouTube APIs and remain subject to YouTube&rsquo;s normal reporting delays and
                finalization adjustments. For questions, support, or data deletion requests,
                contact{" "}
                <Link href="mailto:support@sabeelgroup.org">support@sabeelgroup.org</Link>.
              </Typography>
            </Box>

            <Divider />

            <Stack direction="row" spacing={3} alignItems="center">
              <Link component={NextLink} href="/" underline="hover">
                &larr; Back to Portal Sign In
              </Link>
              <Link component={NextLink} href="/privacy" underline="hover">
                Privacy Policy
              </Link>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
