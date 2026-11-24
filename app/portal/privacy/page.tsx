import type { Metadata } from "next";
import { Box, Container, Divider, Link, Paper, Stack, Typography } from "@mui/material";

export const metadata: Metadata = {
  title: "Privacy Policy | Sabeel Creator Analytics",
  description:
    "Privacy Policy for Sabeel Creator Analytics covering read-only YouTube API access, analysis-only use, token retention, exports, revocation, and deletion.",
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
              <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
                Sabeel Creator Analytics
              </Typography>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                Privacy Policy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Effective Date: November 22, 2026
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Contact:{" "}
                <Link href="mailto:alishabanydev@gmail.com">
                  alishabanydev@gmail.com
                </Link>
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                1. Who We Are
              </Typography>
              <Typography variant="body1">
                Sabeel Creator Analytics (&ldquo;the Portal&rdquo;) is operated by Sabeel Group
                at <strong>analytics.sabeelgroup.org</strong>. For privacy questions or data
                requests, contact{" "}
                <Link href="mailto:alishabanydev@gmail.com">alishabanydev@gmail.com</Link>.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                2. Overview &amp; YouTube API Services Disclosure
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The Portal helps independent content creators and designated Sabeel analytics
                specialists view and analyze authorized YouTube channel performance metrics.
              </Typography>
              <Typography variant="body1">
                The Portal uses <strong>YouTube API Services</strong> to retrieve authorized,{" "}
                <strong>read-only</strong> channel performance metrics after a channel owner
                connects via Google OAuth 2.0. By connecting a YouTube channel to the Portal, you
                agree to be bound by the{" "}
                <Link
                  href="https://www.youtube.com/t/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube Terms of Service
                </Link>{" "}
                and acknowledge that Google handles your account data in accordance with the{" "}
                <Link
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Privacy Policy
                </Link>
                .
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                3. We Do Not Warehouse Your Analytics Data
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We do <strong>not collect or permanently store</strong> your YouTube analytics
                metrics as a product database to sell, publish, or reuse for unrelated purposes.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                When you or an authorized specialist opens a report, the Portal requests the
                metrics from YouTube/Google APIs, displays them for analysis, and lets you take
                the results with you (Excel download and/or a restricted internal Google Sheet
                export). We are not building a separate long-term archive of those metric rows.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Browser <strong>localStorage</strong> is used mainly for Portal login/session and
                to help protect your sign-in and account safety — not for advertising trackers or
                cross-site marketing cookies.
              </Typography>
              <Typography variant="body1">
                What we do keep so the Portal keeps working securely for you: encrypted or
                server-side <strong>OAuth access and refresh tokens</strong> for channels you
                connected, so when you come back you can use the Portal without connecting again,
                unless you disconnect in the Portal or revoke access in Google.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                4. Read-Only Data We Access
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                When an authorized channel owner (&ldquo;Author&rdquo;) connects their channel via
                Google OAuth 2.0, the Portal requests strictly <strong>read-only</strong>{" "}
                permissions (<code>youtube.readonly</code>, <code>yt-analytics.readonly</code>,
                and <code>yt-analytics-monetary.readonly</code>) to retrieve:
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, "& li": { mb: 0.75 } }}>
                <li>
                  <Typography variant="body1">
                    Basic channel profile metadata (Channel ID, Channel Title, Thumbnail, and
                    custom URL/handle when available).
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
                    click-through rate (CTR), and estimated revenue (for monetized channels when
                    Google returns it).
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    OAuth access and refresh tokens required solely to load your authorized
                    reports.
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
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                5. How Data Is Used
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We use connected-channel data only to analyze and show performance in the Portal,
                let creators and authorized Sabeel analysts review the numbers, and let you export
                reports to <strong>Excel</strong> or a <strong>restricted internal Google Sheet</strong>{" "}
                for your own analysis and accounting workflow.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                By connecting your YouTube channel, you expressly authorize Sabeel Group&rsquo;s
                designated internal analytics and accounting specialists to view and export your
                channel&rsquo;s performance reports strictly for performance analysis, accounting
                reconciliation, and creator advisory services.
              </Typography>
              <Typography variant="body1">
                <strong>We do not sell</strong> your channel data. Your data is never published
                publicly, used for advertising, or shared with other creators or unrelated
                external third parties. Each creator account can view only the channel(s)
                connected under that creator&rsquo;s own login (specialists may review authorized
                connected channels for the purposes above).
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                6. Tokens &amp; Coming Back Later
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                As long as your channel stays connected in the Portal and you have not revoked
                Google access, stored OAuth tokens remain so returning users can continue without
                connecting again.
              </Typography>
              <Typography variant="body1">
                Tokens stop working or are removed when you click <strong>Disconnect</strong> in
                the Portal, or when you revoke the app in Google Account permissions. Logging out
                of the Portal session is not the same as disconnecting YouTube.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                7. Security Controls
              </Typography>
              <Typography variant="body1">
                All communication between your browser, our servers, and Google APIs is
                transmitted over HTTPS/TLS. Access to the Portal is limited to authorized Author,
                Accountant, and admin roles. We do not use third-party advertising trackers or
                cross-site marketing cookies.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                8. Children
              </Typography>
              <Typography variant="body1">
                Sabeel Creator Analytics is intended for creators and authorized specialists. It
                is not directed at children and is separate from any child-facing Sabeel Kids
                viewing experiences.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                9. Google / YouTube Compliance
              </Typography>
              <Typography variant="body1">
                Use of YouTube data through the Portal is intended to comply with YouTube API
                Services requirements. You remain bound by YouTube&rsquo;s terms; Google&rsquo;s
                privacy policy applies to data Google holds. See also the{" "}
                <Link
                  href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube API Services Terms of Service
                </Link>
                .
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                10. Revoking Access &amp; Requesting Data Deletion
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You remain in full control of your channel connection and may revoke access at
                any time through either method below:
              </Typography>
              <Box component="ul" sx={{ pl: 3, m: 0, "& li": { mb: 1 } }}>
                <li>
                  <Typography variant="body1">
                    <strong>Inside the Portal:</strong> Sign in and click{" "}
                    <strong>Disconnect</strong> next to your connected channel to remove stored
                    OAuth credentials.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>Via Google Security Settings:</strong> Revoke Sabeel Creator Analytics
                    from{" "}
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
                <strong>Data Deletion Requests:</strong> To request deletion of Portal records
                associated with your channel, contact{" "}
                <Link href="mailto:alishabanydev@gmail.com">alishabanydev@gmail.com</Link>.
                Deletion requests are completed as soon as possible and within{" "}
                <strong>7 calendar days</strong>. Deleting data stored by the Portal does not
                delete or modify data stored on YouTube itself.
              </Typography>
            </Box>

            <Divider />

            <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
              <Link href="/" underline="hover">
                &larr; Back to Home
              </Link>
              <Link href="/sign-in" underline="hover">
                Sign In
              </Link>
              <Link href="/terms" underline="hover">
                Terms of Service
              </Link>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
