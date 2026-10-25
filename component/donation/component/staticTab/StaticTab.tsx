import { Stack, type SxProps } from "@mui/material";
import ChartCard from "./component/ChartCard";
import StatusCard from "./component/StatusCard";
import { DonationProject } from "../../BodySection";
import TeamCard from "./component/TeamCard";
import JoinDonors from "../../JoinDonors";

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
      {projectData.staff && projectData.staff.length > 0 && (
        <TeamCard
          projectData={projectData}
          cardSx={cardSx}
          cardHeaderSx={cardHeaderSx}
        />
      )}
      <JoinDonors />
    </Stack>
  );
};

export default StaticTab;
