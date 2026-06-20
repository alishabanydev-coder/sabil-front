"use client";

import WatchPlayerPlayIcon from "@/component/appCatalogue/watch/WatchPlayerPlayIcon";
import { Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";
import ReactPlayer from "react-player";

type DonationProject = {
  _id: string;
  title: string;
  slug: string;
  poster: string;
  shortDescription: string;
  goalAmount: number;
  raisedAmount: number;
  videoUrl?: string | null;
};

const TopSection = ({ projectData }: { projectData: DonationProject }) => {
  const hasVideoUrl =
    typeof projectData.videoUrl === "string" &&
    projectData.videoUrl.trim().length > 0;

  return (
    <Stack sx={{ width: "88%", mx: "auto", gap: 3 }}>
      <Stack>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            fontFamily: "Namecat",
            fontSize: { xs: 14, sm: 18, md: 26, lg: 32, xl: 40 },
            letterSpacing: 2,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {projectData.title}
        </Typography>
      </Stack>

      <Stack
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "start",
        }}
      >
        <Stack
          sx={{
            position: "relative",
            width: { xs: "100%", sm: "60%" },
            aspectRatio: "16 / 9",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "black",
            flexShrink: 0,
            "& .react-player__preview": {
              position: "relative",
            },
          }}
        >
          {hasVideoUrl ? (
            <ReactPlayer
              src={projectData.videoUrl}
              light={
                projectData.poster ? (
                  <img
                    src={projectData.poster}
                    alt={projectData.title || "Project intro"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  true
                )
              }
              playIcon={<WatchPlayerPlayIcon />}
              previewAriaLabel={`Play ${projectData.title || "video"}`}
              controls
              width="100%"
              height="100%"
            />
          ) : (
            <Image
              src={projectData.poster}
              alt={projectData.title}
              fill
              sizes="60vw"
              style={{ objectFit: "cover" }}
            />
          )}
        </Stack>

        <Stack
          sx={{
            width: { xs: "100%", sm: "40%" },
            height: "100%",
            px: { xs: 0, sm: 2 },
            gap: 3,
            pt: { xs: 2, sm: 1 },
          }}
        >
          <Stack>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 500,
                fontSize: { xs: 10, sm: 14, md: 16, lg: 18, xl: 20 },
                textAlign: "left",
              }}
            >
              {projectData.shortDescription}
            </Typography>
            <Stack sx={{ gap: 1, pt: 2 }}>
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  fontSize: { xs: 10, sm: 12, md: 16, lg: 18, xl: 20 },
                }}
              >
                produces by{" "}
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 500,
                  color: "primary.main",
                  fontFamily: "Namecat",
                  letterSpacing: 1.5,
                  fontSize: { xs: 10, sm: 12, md: 16, lg: 18, xl: 20 },
                }}
              >
                Sabeel Media Cast
              </Typography>
            </Stack>
          </Stack>
          <Divider flexItem />
          <Stack>
            <Typography
              variant="h5"
              component="h5"
              sx={{
                fontWeight: 500,
                fontSize: { xs: 9, sm: 12, md: 14, lg: 16, xl: 18 },
                textAlign: "left",
              }}
            >
              <b> $$ </b> Donators, Raised <b>{projectData.raisedAmount}</b> of{" "}
              <b>{projectData.goalAmount}</b> to bring this project to life.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TopSection;
