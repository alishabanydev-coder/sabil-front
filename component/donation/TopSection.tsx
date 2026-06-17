import { Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";

type DonationProject = {
  _id: string;
  title: string;
  slug: string;
  poster: string;
  shortDescription: string;
  goalAmount: number;
  raisedAmount: number;
};

const TopSection = ({ projectData }: { projectData: DonationProject }) => {
  return (
    <Stack sx={{ width: "88%", mx: "auto", gap: 3,  }}>
      <Stack>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            fontFamily: "Namecat",
            fontSize: { xs: 12, sm: 16, md: 26, lg: 32, xl: 40 },
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
          flexDirection: "row",
          alignItems: "start",
        }}
      >
        <Stack sx={{ position: "relative", width: "60%", aspectRatio: "16/9" }}>
          <Image src={"/news1.png"} alt={"project poster"} fill />
          {/* <Image src={projectData.poster} alt={projectData.title} fill /> */}
        </Stack>

        <Stack sx={{ width: "40%", height: "100%", px: 2, gap: 3, pt: 1 }}>
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
              {" "}
              <b> $$ </b> Donators, Raised <b>{projectData.raisedAmount}</b>
              of <b>{projectData.goalAmount}</b> to bring this project to life.{" "}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TopSection;
