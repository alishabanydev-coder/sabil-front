"use client";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  disconnectYtReportChannel,
  downloadYtReportExcel,
  fetchFreshYtReport,
  fetchYtReportChannels,
  startYtReportOAuth,
  syncYtReportToGoogleSheet,
  type YtReportChannelError,
  type YtReportChannelItem,
  type YtReportRow,
} from "../../services/ytReportsApi";
import {
  notifyAdminError,
  notifyAdminSuccess,
} from "../../snackbar/notifyAdmin";

type YtReportPanelProps = {
  role: "author" | "accountant";
};

function getPreviousMonthDates() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function getCurrentMonthDates() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: now.toISOString().slice(0, 10),
  };
}

export default function YtReportPanel({ role }: YtReportPanelProps) {
  const initialRange = getPreviousMonthDates();
  const [startDate, setStartDate] = useState(initialRange.startDate);
  const [endDate, setEndDate] = useState(initialRange.endDate);

  const [channels, setChannels] = useState<YtReportChannelItem[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const [rows, setRows] = useState<YtReportRow[]>([]);
  const [channelErrors, setChannelErrors] = useState<YtReportChannelError[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [syncingSheet, setSyncingSheet] = useState(false);

  const loadChannels = useCallback(async () => {
    setLoadingChannels(true);
    const result = await fetchYtReportChannels();
    setLoadingChannels(false);

    if (!result.ok) {
      notifyAdminError(result.message);
      return;
    }

    setChannels(result.channels);
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "YT_REPORT_OAUTH_RESULT") {
        return;
      }
      setConnecting(false);
      if (event.data.ok) {
        notifyAdminSuccess(event.data.message || "YouTube channel connected.");
        loadChannels();
      } else {
        notifyAdminError(event.data.message || "YouTube connection failed.");
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [loadChannels]);

  const handleConnectChannel = async () => {
    setConnecting(true);
    const result = await startYtReportOAuth();
    if (!result.ok || !result.authUrl) {
      setConnecting(false);
      notifyAdminError(result.message);
      return;
    }

    const popup = window.open(
      result.authUrl,
      "yt_report_oauth",
      "width=560,height=680,menubar=no,toolbar=no"
    );

    if (!popup) {
      setConnecting(false);
      notifyAdminError("Popup was blocked. Please allow popups for this site.");
      return;
    }

    const pollTimer = window.setInterval(() => {
      if (popup.closed) {
        window.clearInterval(pollTimer);
        setConnecting(false);
        loadChannels();
      }
    }, 1000);
  };

  const handleDisconnectChannel = async (channel: YtReportChannelItem) => {
    const confirmed = window.confirm(
      `Disconnect channel "${channel.channelTitle}"?`
    );
    if (!confirmed) {
      return;
    }

    const result = await disconnectYtReportChannel(channel.youtubeChannelId);
    if (!result.ok) {
      notifyAdminError(result.message);
      return;
    }

    notifyAdminSuccess(result.message);
    loadChannels();
  };

  const handleFetchFreshReport = async () => {
    if (!startDate || !endDate || startDate > endDate) {
      notifyAdminError("Select a valid start and end date.");
      return;
    }

    setLoadingReport(true);
    const result = await fetchFreshYtReport(startDate, endDate);
    setLoadingReport(false);

    if (!result.ok) {
      notifyAdminError(result.message);
      return;
    }

    setRows(result.rows);
    setChannelErrors(result.errors);
    notifyAdminSuccess(`Loaded fresh report for ${result.rows.length} channel(s).`);
  };

  const handleExportExcel = async () => {
    if (!startDate || !endDate || startDate > endDate) {
      notifyAdminError("Select a valid start and end date.");
      return;
    }

    setExportingExcel(true);
    const result = await downloadYtReportExcel(startDate, endDate);
    setExportingExcel(false);

    if (!result.ok) {
      notifyAdminError(result.message);
      return;
    }

    notifyAdminSuccess(result.message);
  };

  const handleSyncSheet = async () => {
    if (!startDate || !endDate || startDate > endDate) {
      notifyAdminError("Select a valid start and end date.");
      return;
    }

    setSyncingSheet(true);
    const result = await syncYtReportToGoogleSheet(startDate, endDate);
    setSyncingSheet(false);

    if (!result.ok) {
      notifyAdminError(result.message);
      return;
    }

    setRows(result.rows);
    setChannelErrors(result.errors);
    notifyAdminSuccess(result.message);
  };

  const applyPreviousMonth = () => {
    const range = getPreviousMonthDates();
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  };

  const applyCurrentMonth = () => {
    const range = getCurrentMonthDates();
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  };

  return (
    <Stack sx={{ gap: 2.5, height: "calc(100vh - 32px)", overflow: "hidden" }}>
      {/* Header & Connected Channels */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>
              {role === "accountant"
                ? "YouTube Accounting & Channel Reports"
                : "My YouTube Channel Reports"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {role === "accountant"
                ? `Connected channels across all authors: ${channels.length}`
                : "Connect each YouTube channel once, then view live reports or export Excel anytime."}
            </Typography>
          </Box>

          {role === "author" && (
            <Button
              variant="contained"
              onClick={handleConnectChannel}
              disabled={connecting}
              startIcon={
                connecting ? <CircularProgress size={18} color="inherit" /> : null
              }
            >
              {connecting ? "Connecting..." : "Connect YouTube Channel"}
            </Button>
          )}
        </Stack>

        {role === "author" ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            Google always shows <strong>Gmail accounts</strong> first — that is
            normal. To connect <strong>Sabeel Kids</strong>,{" "}
            <strong>Sabeel Toons</strong>, or another Brand Account channel: click
            Connect again, then on Google&apos;s chooser pick the{" "}
            <strong>YouTube channel / Brand Account name</strong> (or that
            channel&apos;s own Gmail), not only the same Gmail that owns Story
            Book. One OAuth click = one channel. Repeat for each channel.
          </Alert>
        ) : null}

        <Stack
          direction="row"
          sx={{ gap: 1, flexWrap: "wrap", mt: 2, alignItems: "center" }}
        >
          {loadingChannels ? (
            <CircularProgress size={22} />
          ) : channels.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {role === "author"
                ? "No YouTube channels connected yet. Click 'Connect YouTube Channel' above."
                : "No authors have connected any YouTube channels yet."}
            </Typography>
          ) : (
            channels.map((ch) => {
              const handle = ch.customUrl
                ? ch.customUrl.startsWith("@")
                  ? ch.customUrl
                  : `@${ch.customUrl}`
                : "";
              const baseLabel = handle
                ? `${ch.channelTitle} (${handle})`
                : ch.channelTitle;
              return (
                <Chip
                  key={ch.youtubeChannelId}
                  avatar={
                    ch.channelThumbnail ? (
                      <Avatar src={ch.channelThumbnail} alt={ch.channelTitle} />
                    ) : undefined
                  }
                  label={
                    role === "accountant" && ch.adminName
                      ? `${baseLabel} · ${ch.adminName}`
                      : baseLabel
                  }
                  onDelete={
                    role === "author"
                      ? () => handleDisconnectChannel(ch)
                      : undefined
                  }
                  variant="outlined"
                  color="primary"
                />
              );
            })
          )}
        </Stack>
      </Paper>

      {/* Date Range & Action Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          sx={{
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" sx={{ gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Button size="small" variant="outlined" onClick={applyPreviousMonth}>
              Previous Month
            </Button>
            <Button size="small" variant="outlined" onClick={applyCurrentMonth}>
              This Month
            </Button>
          </Stack>

          <Stack direction="row" sx={{ gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={handleFetchFreshReport}
              disabled={loadingReport || channels.length === 0}
              startIcon={
                loadingReport ? <CircularProgress size={18} color="inherit" /> : null
              }
            >
              Get Fresh Report
            </Button>

            <Button
              variant="outlined"
              onClick={handleExportExcel}
              disabled={exportingExcel || channels.length === 0}
              startIcon={
                exportingExcel ? <CircularProgress size={18} color="inherit" /> : null
              }
            >
              Export Excel
            </Button>

            {role === "accountant" && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSyncSheet}
                disabled={syncingSheet || channels.length === 0}
                startIcon={
                  syncingSheet ? <CircularProgress size={18} color="inherit" /> : null
                }
              >
                Write to Google Sheet
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {channelErrors.length > 0 && (
        <Stack sx={{ gap: 1 }}>
          {channelErrors.map((err) => (
            <Alert key={err.youtubeChannelId} severity="warning">
              <strong>{err.channelTitle}:</strong> {err.message}
            </Alert>
          ))}
        </Stack>
      )}

      {/* Fresh Report Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          flex: 1,
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          overflow: "auto",
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Year</TableCell>
              <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Date of Report</TableCell>
              <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Admin Name</TableCell>
              <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Channel Name</TableCell>
              <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Month</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Subs Gained</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Subs Last of Month</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Growth Rate</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Total Views</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>No.Video</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>No.Shorts</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Watch Time (Hrs)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Comments</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Revenu ($)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Impressions</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>CTR</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>Avg View Duration (s)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={17} align="center" sx={{ py: 6, color: "text.secondary" }}>
                  {loadingReport
                    ? "Fetching fresh YouTube analytics..."
                    : "Choose a date range and click 'Get Fresh Report' to load live data."}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={`${row.youtubeChannelId}-${row.month}`} hover>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{row.year}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{row.dateOfReport}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{row.adminName}</TableCell>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                    {row.channelName}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{row.month}</TableCell>
                  <TableCell align="right">{row.subscribersGained.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.subscribersLastOfMonth.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.subscriberGrowthRate}%</TableCell>
                  <TableCell align="right">{row.totalViews.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.noVideo}</TableCell>
                  <TableCell align="right">{row.noShorts}</TableCell>
                  <TableCell align="right">{row.totalWatchTimeHours.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.numberOfComments.toLocaleString()}</TableCell>
                  <TableCell align="right">${row.revenue.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.impressions.toLocaleString()}</TableCell>
                  <TableCell align="right">{row.ctr}%</TableCell>
                  <TableCell align="right">{row.averageViewDuration}s</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
