import Banner from "@/component/donation/Banner";
import DonateNow from "@/component/donation/DonateNow";
import FAQSection from "@/component/donation/FAQSection";
import ProjectSection from "@/component/donation/ProjectSection";
import { Stack } from "@mui/material";

const DonationPage = () => {
  return (
    <Stack
      sx={{
        direction: "rtl",
        width: "88%",
        minHeight: "100vh",
        mx: 'auto',
        px: { xs: 2, md: 10 },
        pt: { xs: 14, md: 12 },
        pb: { xs: 6, md: 18 },
        gap: 4,
      }}
    >
      <Banner />
      <ProjectSection />
      <DonateNow />
      <FAQSection />
    </Stack>
  );
};

export default DonationPage;
