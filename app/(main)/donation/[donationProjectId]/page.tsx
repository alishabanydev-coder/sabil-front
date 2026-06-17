import TabsSection from "@/component/donation/TabsSection";
import TopSection from "@/component/donation/TopSection";
import { dummyDonationProject } from "@/component/donation/dummy/donationProject";
import { Stack } from "@mui/material";

const DonationProjectPage = () => {
  const projectData = dummyDonationProject;

  return (
    <Stack
      sx={{
        width: "100%",
        mx: "auto",
        direction: "ltr",
        gap: 3,
        pt: 12,
        pb: 25,
      }}
    >
      <TopSection projectData={projectData} />
      <Stack sx={{ width: "100%", bgcolor: "background.paper" }}>
        <TabsSection />
      </Stack>
    </Stack>
  );
};

export default DonationProjectPage;
