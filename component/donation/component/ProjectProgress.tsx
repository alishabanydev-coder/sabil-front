"use client";

import { Avatar, Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

export type PublicProjectStep = {
  id: string;
  label: string;
  status: "upcoming" | "in_progress" | "completed" | "skipped";
  spentAmount?: number;
  order?: number;
};

export type PublicStaffMember = {
  id: string;
  name: string;
  role: string;
  photo?: string | null;
  bio?: string | null;
  order?: number;
};

const PIE_COLORS = ["#5B8C5A", "#C4A35A", "#4A7C9B", "#B85C38", "#6B5B95"];

const SpentPie = ({
  slices,
  total,
  currencySymbol,
}: {
  slices: { label: string; value: number; color: string }[];
  total: number;
  currencySymbol: string;
}) => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <Stack sx={{ alignItems: "center", gap: 2, minWidth: 180 }}>
      <Box sx={{ position: "relative", width: 160, height: 160 }}>
        <svg viewBox="0 0 160 160" width="160" height="160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#eee"
            strokeWidth="22"
          />
          {slices.map((slice) => {
            const length = (slice.value / total) * circumference;
            const dashoffset = circumference * 0.25 + offset;
            offset += length;

            return (
              <circle
                key={slice.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth="22"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-dashoffset}
              />
            );
          })}
        </svg>
        <Stack
          sx={{
            position: "absolute",
            inset: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Spent so far
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>
            {currencySymbol}
            {total.toLocaleString()}
          </Typography>
        </Stack>
      </Box>
      <Stack sx={{ gap: 0.5, width: "100%" }}>
        {slices.map((slice) => (
          <Stack
            key={slice.label}
            sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: slice.color,
                flexShrink: 0,
              }}
            />
            <Typography variant="body2">
              {slice.label} · {currencySymbol}
              {slice.value.toLocaleString()}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

const ProjectProgress = ({
  steps = [],
  staff = [],
  currency = "USD",
}: {
  steps?: PublicProjectStep[];
  staff?: PublicStaffMember[];
  currency?: string;
}) => {
  const currencySymbol = currency === "INR" ? "₹" : "$";

  const orderedSteps = useMemo(
    () => [...steps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [steps]
  );

  const spentSlices = useMemo(() => {
    return orderedSteps
      .filter((step) => Number(step.spentAmount ?? 0) > 0)
      .map((step, index) => ({
        label: step.label,
        value: Number(step.spentAmount),
        color: PIE_COLORS[index % PIE_COLORS.length],
      }));
  }, [orderedSteps]);

  const spentTotal = spentSlices.reduce((sum, slice) => sum + slice.value, 0);

  const orderedStaff = useMemo(
    () => [...staff].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [staff]
  );

  if (orderedSteps.length === 0 && orderedStaff.length === 0) {
    return null;
  }

  return (
    <Stack sx={{ gap: 4, py: 3 }}>
      {orderedSteps.length > 0 ? (
        <Stack sx={{ gap: 2 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontFamily: "Namecat",
              color: "primary.main",
              letterSpacing: 1.5,
              fontSize: { xs: 12, sm: 14, md: 18 },
            }}
          >
            Production steps
          </Typography>
          <Stack
            sx={{
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              alignItems: { md: "flex-start" },
            }}
          >
            <Stack sx={{ flex: 1, gap: 1.5 }}>
              {orderedSteps.map((step, index) => (
                <Stack
                  key={step.id}
                  sx={{ flexDirection: "row", alignItems: "center", gap: 1.5 }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor:
                        step.status === "completed"
                          ? "primary.main"
                          : step.status === "in_progress"
                            ? "warning.main"
                            : "action.disabledBackground",
                      color: "background.paper",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Stack>
                    <Typography sx={{ fontWeight: 600 }}>{step.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.status.replace("_", " ")}
                      {Number(step.spentAmount) > 0
                        ? ` · ${currencySymbol}${Number(step.spentAmount).toLocaleString()}`
                        : ""}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
            {spentTotal > 0 ? (
              <SpentPie
                slices={spentSlices}
                total={spentTotal}
                currencySymbol={currencySymbol}
              />
            ) : null}
          </Stack>
        </Stack>
      ) : null}

      {orderedStaff.length > 0 ? (
        <Stack sx={{ gap: 2 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontFamily: "Namecat",
              color: "primary.main",
              letterSpacing: 1.5,
              fontSize: { xs: 12, sm: 14, md: 18 },
            }}
          >
            Project staff
          </Typography>
          <Stack
            sx={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {orderedStaff.map((member) => (
              <Stack
                key={member.id}
                sx={{
                  width: { xs: "100%", sm: 200 },
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1,
                  p: 1.5,
                }}
              >
                <Avatar
                  src={member.photo || undefined}
                  alt={member.name}
                  sx={{ width: 72, height: 72 }}
                />
                <Typography sx={{ fontWeight: 700 }}>{member.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
                {member.bio ? (
                  <Typography variant="caption" color="text.secondary">
                    {member.bio}
                  </Typography>
                ) : null}
              </Stack>
            ))}
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default ProjectProgress;
