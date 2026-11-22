import type { Metadata } from "next";
import NextLink from "next/link";
import { Box, Container, Divider, Link, Paper, Stack, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Privacy Policy | Sabeel Creator Analytics",
  description:
    "Privacy Policy for Sabeel Creator Analytics covering read-only YouTube API data access, specialist review, token revocation, and data deletion.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function PortalPrivacyPage() {
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
                Privacy Policy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Effective Date: November 22, 2026
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                1. Overview &amp; YouTube API Services Disclosure
              </Typography>
              <Typography variant="body1" paragraph>
                Sabeel Creator Analytics (&ldquo;the Portal&rdquo;), operated by Sabeel Group at{" "}
                <strong>analytics.sabeelgroup.org</strong>, helps independent content creators
                track and review their channel performance metrics alongside designated
                internal analytics specialists.
              </Typography>
              <Typography variant="body1">
                The Portal uses <strong>YouTube API Services</strong> to retrieve authorized,
                read-only channel performance metrics. By connecting a YouTube channel to the
                Portal, you agree to be bound by the{" "}
                <Link
                  href="https://www.youtube.com/t/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube Terms of Service
                </Link>{" "}
                and acknowledge that Google handles your account data in accordance with the{" "}
                <Link
                  href="http://www.google.com/policies/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Privacy Policy
                </Link>
                .
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                2. Read-Only Data We Access
              </Typography>
              <Typography variant="body1" paragraph>
                When an authorized channel owner (&ldquo;Author&rdquo;) connects their channel via
                Google OAuth 2.0, the Portal requests strictly <strong>read-only</strong>{" "}
                permissions (<code>youtube.readonly</code>, <code>yt-analytics.readonly</code>,
                and <code>yt-analytics-monetary.readonly</code>) to retrieve:
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, "& li": { mb: 0.75 } }}>
                <li>
                  <Typography variant="body1">
                    Basic channel profile metadata (Channel ID, Channel Title, and Thumbnail).
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Published video and Shorts upload counts within the selected reporting
                    period.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Channel performance metrics: views, watch time, average view duration,
                    comments, subscribers gained/lost, subscriber totals, thumbnail impressions,
                    click-through rate (CTR), and estimated revenue (for monetized channels).
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    Encrypted or server-side OAuth access and refresh tokens required solely to
                    load your authorized reports.
                  </Typography>
                </li>
              </Box>
              <Typography variant="body1" sx={{ mt: 1.5 }}>
                <strong>No Write Access:</strong> The Portal cannot upload, edit, or delete
                videos, post comments, or modify any setting on your YouTube channel or Google
                account.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                3. How Data Is Used &amp; Authorized Specialist Review
              </Typography>
              <Typography variant="body1" paragraph>
                By connecting your YouTube channel to the Portal, you expressly authorize Sabeel
                Group&rsquo;s designated internal analytics and accounting specialists to access,
                compile, and export your channel&rsquo;s performance reports (including into
                restricted internal spreadsheets and downloadable Excel files) strictly for
                performance analysis, accounting reconciliation, and creator advisory services.
              </Typography>
              <Typography variant="body1">
                <strong>Strict Confidentiality:</strong> Each creator account can view only the
                channel(s) connected under that creator&rsquo;s own login. Your channel data is{" "}
                <strong>never</strong> sold, published publicly, used for advertising, or shared
                with other creators or external third parties.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                4. Local Storage &amp; Security Controls
              </Typography>
              <Typography variant="body1">
                The Portal uses browser local storage solely to maintain your authenticated
                portal session and proof-of-work bot protection on the sign-in form. We do not
                use third-party advertising trackers or cross-site marketing cookies. All
                communication between your browser, our servers, and Google APIs is transmitted
                over HTTPS/TLS.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                5. Revoking Access &amp; Requesting Data Deletion
              </Typography>
              <Typography variant="body1" paragraph>
                You remain in full control of your channel connection and may revoke access at
                any time through either method below:
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, "& li": { mb: 1 } }}>
                <li>
                  <Typography variant="body1">
                    <strong>Inside the Portal:</strong> Sign in to the Portal and click{" "}
                    <strong>Disconnect</strong> next to your connected channel to remove stored
                    OAuth credentials immediately.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>Via Google Security Settings:</strong> Revoke Sabeel Creator
                    Analytics directly from your Google Account permissions page at{" "}
                    <Link
                      href="https://security.google.com/settings/security/permissions"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://security.google.com/settings/security/permissions
                    </Link>
                    .
                  </Typography>
                </li>
              </Box>
              <Typography variant="body1" sx={{ mt: 1.5 }}>
                <strong>Data Deletion Requests:</strong> To request deletion of any stored
                portal records or exported report rows associated with your channel, contact our
                team at{" "}
                <Link href="mailto:support@sabeelgroup.org">support@sabeelgroup.org</Link>. All
                deletion requests are completed as soon as possible and within{" "}
                <strong>7 calendar days</strong>. Deleting data stored by the Portal does not
                delete or modify data stored on YouTube itself.
              </Typography>
            </Box>

            <Divider />

            <Stack direction="row" spacing={3} alignItems="center">
              <Link component={NextLink} href="/" underline="hover">
                &larr; Back to Portal Sign In
              </Link>
              <Link component={NextLink} href="/terms" underline="hover">
                Terms of Service
              </Link>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
