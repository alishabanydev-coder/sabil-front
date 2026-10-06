import DonationBanner from "@/component/donation/DonationBanner";
import ProjectSection from "@/component/donation/ProjectSection";
import { Stack } from "@mui/material";
import YourImpact from "@/component/donation/YourImpact";
import PeopleOpinion from "@/component/donation/PeopleOpinion";
import { fetchDonationFeaturedComments } from "@/component/donation/services/commentsPublicApi";
import JoinDonors from "@/component/donation/JoinDonors";

const DonationPage = async () => {
  const featuredCommentsResult = await fetchDonationFeaturedComments();
  const featuredComments = featuredCommentsResult.ok
    ? featuredCommentsResult.comments
    : [];

  return (
    <Stack
      sx={{
        direction: "rtl",
        width: "100%",
        minHeight: "100vh",
        mx: "auto",
        pb: { xs: 0, md: 0 },
        gap: 4,
      }}
    >
      <DonationBanner />
      <Stack
        sx={{
          px: { xs: 2, md: 14 },
          pt: { xs: 6, sm: 10, md: 14 },
          gap: { xs: 2, md: 4 },
        }}
      >
        <ProjectSection />
        <YourImpact />
        <PeopleOpinion
          comments={featuredComments}
          errorMsg={
            featuredCommentsResult.ok ? "" : featuredCommentsResult.message
          }
        />
        <JoinDonors />
      </Stack>
    </Stack>
  );
};

export default DonationPage;
