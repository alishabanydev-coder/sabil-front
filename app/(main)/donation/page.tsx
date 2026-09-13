import DonationBanner from "@/component/donation/DonationBanner";
import DonateNow from "@/component/donation/DonateNow";
import FAQSection from "@/component/donation/FAQSection";
import ProjectSection from "@/component/donation/ProjectSection";
import { Stack } from "@mui/material";
import Banner from "@/component/donation/Banner";

const DonationPage = () => {
  return (
    <Stack
      sx={{
        direction: "rtl",
        width: "100%",
        minHeight: "100vh",
        mx: "auto",
        px: { xs: 2, md: 10 },
        pt: { xs: 14, md: 12 },
        pb: { xs: 6, md: 18 },
        gap: 4,
      }}
    >
      {/* <DonationBanner /> */}
      <Banner />
      <ProjectSection />
      <DonateNow />
      <FAQSection />
    </Stack>
  );
};

export default DonationPage;
