import TabsSection from "@/component/donation/TabsSection";
import TopSection from "@/component/donation/TopSection";
import { fetchPublicDonationProject } from "@/component/donation/services/donationPublicApi";
import { Stack } from "@mui/material";
import { notFound } from "next/navigation";

const DonationProjectPage = async ({
  params,
}: {
  params: Promise<{ donationProjectId: string }>;
}) => {
  const { donationProjectId } = await params;
  const result = await fetchPublicDonationProject(donationProjectId);

  if (!result.ok || !result.donationProject) {
    notFound();
  }

  const projectData = result.donationProject;

  return (
    <Stack
      sx={{
        width: "100%",
        mx: "auto",
        direction: "ltr",
        gap: 3,
        pt: { xs: 8, sm: 10, md: 12 },
        pb: 10,
      }}
    >
      <TopSection projectData={projectData} />
      <Stack sx={{ width: "100%", bgcolor: "background.paper" }}>
        <TabsSection projectData={projectData} />
      </Stack>
    </Stack>
  );
};

export default DonationProjectPage;
