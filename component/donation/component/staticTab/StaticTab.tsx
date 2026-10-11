import { Stack, Typography, type SxProps } from "@mui/material";
import ChartCard from "./component/ChartCard";
import StatusCard from "./component/StatusCard";

type ProjectStepStatus = "upcoming" | "in_progress" | "completed" | "skipped";

type ProjectStep = {
  id: string;
  label: string;
  status: ProjectStepStatus;
  spentAmount?: number;
  order?: number;
};

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
  steps?: ProjectStep[];
};

const cardHeaderSx = {
  borderLeft: "5px solid",
  borderColor: "divider",
  borderRadius: 2,
  gap: { xs: 0.5, sm: 0.7, md: 1 },
  py: 1,
  px: 2,
  ml: { xs: 1, sm: 0 },
};

const StaticTab = ({
  cardSx,
  projectData,
}: {
  cardSx: SxProps;
  projectData: DonationProject;
}) => {
  return (
    <Stack sx={{ direction: "ltr", gap: { xs: 2, sm: 3, md: 4 } }}>
      <StatusCard
        projectData={projectData}
        cardSx={cardSx}
        cardHeaderSx={cardHeaderSx}
      />
      <ChartCard
        projectData={projectData}
        cardSx={cardSx}
        cardHeaderSx={cardHeaderSx}
      />
    </Stack>
  );
};

export default StaticTab;
