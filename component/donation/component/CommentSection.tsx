import { Button, Stack, Typography } from "@mui/material";
import { type DonationUpdate } from "./UpdateCard";

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

const CommentSection = ({ projectData }: { projectData: DonationProject }) => {
  return (
    <Stack sx={{ width: "100%", gap: 2, pt: 3, pb: 8, direction: "ltr" }}>
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: 12, sm: 16, md: 26, lg: 28, xl: 30 },
          color: "primary.main",
          fontFamily: "Namecat",
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          textAlign: "start",
        }}
      >
        People's Comments on this project
      </Typography>
      <Stack direction="row" sx={{ gap: 2, width: "100%" }}>
        <Stack sx={{ width: "70%" }}> hi</Stack>
        <Stack
          sx={{ width: "30%", borderLeft: "3px solid #e0e0e0", px: 2, gap: 2 }}
        >
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: 10, sm: 12, md: 14, lg: 16 },
              width: "100%",
            }}
          >
            This is your space to offer support and feedback. Remember to be
            constructive—there's a human behind this project.
          </Typography>
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: 10, sm: 12, md: 16, lg: 18 },
              fontWeight: 700,
              width: "100%",
            }}
          >
            Have a question for the creator?
          </Typography>
          <Button variant="text" color="primary">
            Check this project's FAQ
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CommentSection;
