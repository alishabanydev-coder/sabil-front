"use client";

import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import UpdateCard, { type DonationUpdate } from "./UpdateCard";

type DonationProject = {
  _id: string;
  title: string;
  slug: string;
  poster: string;
  shortDescription: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  currency?: "USD" | "INR" | string;
  videoUrl?: string | null;
  faq?: {
    header: string;
    summary: string;
    order: number;
  }[];
  sections?: {
    id: string;
    header: string;
    text: string;
    images: string[];
    order: number;
  }[];
  updates?: DonationUpdate[];
};

const Updates = ({ projectData }: { projectData: DonationProject }) => {
  const updates = useMemo(
    () =>
      [...(projectData.updates ?? [])].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [projectData.updates]
  );

  if (updates.length === 0) {
    return (
      <Stack sx={{ width: "88%", mx: "auto", py: 4 }}>
        <Typography
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontSize: { xs: 12, sm: 14, md: 16 },
          }}
        >
          No updates yet.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        width: "100%",
        py: 2,
        gap: 3,
      }}
    >
      {updates.map((update, index) => (
        <UpdateCard
          key={update.id}
          update={update}
          updateNumber={updates.length - index}
        />
      ))}
    </Stack>
  );
};

export default Updates;
