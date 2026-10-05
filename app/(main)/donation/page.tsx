import DonationBanner from "@/component/donation/DonationBanner";
import DonateNow from "@/component/donation/DonateNow";
import FAQSection from "@/component/donation/FAQSection";
import ProjectSection from "@/component/donation/ProjectSection";
import { Stack } from "@mui/material";
import Banner from "@/component/donation/Banner";
import YourImpact from "@/component/donation/YourImpact";

const DonationPage = () => {
  return (
    <Stack
      sx={{
        direction: "rtl",
        width: "100%",
        minHeight: "100vh",
        mx: "auto",
        pb: { xs: 6, md: 18 },
        gap: 4,
      }}
    >
      <DonationBanner />
      {/* <Banner /> */}
      <Stack
        sx={{
          px: { xs: 2, md: 14 },
          pt: { xs: 14, md: 10 },
          gap: { xs: 2, md: 4 },
        }}
      >
        <ProjectSection />
        <YourImpact />

        {/* <DonateNow />
        <FAQSection /> */}
      </Stack>
    </Stack>
  );
};

export default DonationPage;
