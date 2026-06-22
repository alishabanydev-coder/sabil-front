import { Box, Stack } from "@mui/material";
import Banner from "@/component/home/banner/Banner";
import BreakDown from "@/component/home/breakdown/BreakDown";
import WatchUs from "@/component/home/watchUs/WatchUs";
import PeopleOpinion from "@/component/home/peopleOpinion/PeopleOpinion";
import NewsFromUs from "@/component/home/newsFromUs/NewsFromUs";
import FollowUs from "@/component/home/followUs/FollowUs";
import LetUsCallYou from "@/component/home/letUsCallYou/LetUsCallYou";
import { fetchPublicMainPageLayoutItems } from "@/component/admin/services/mainPageLayoutApi";
import { fetchPublicSocialMediaLinks } from "@/component/admin/services/socialMediaApi";
import { fetchPublicAboutUs } from "@/component/admin/services/aboutUsApi";
import ProjectCatalogue from "@/component/home/projectCatalogue/ProjectCatalogue";

const sections = [
  "banner",
  "projects",
  "catalogues",
  "breakdown",
  "video",
  "comment",
  "blog",
] as const;

type MainSectionName = (typeof sections)[number];
type SectionDataMap = Record<MainSectionName, any[]>;

const fetchPublicSectionData = async () => {
  const results = await Promise.all(
    sections.map((section) => fetchPublicMainPageLayoutItems(section))
  );
  return sections.reduce((accumulator, sectionName, index) => {
    accumulator[sectionName] = results[index];
    return accumulator;
  }, {} as SectionDataMap);
};

export default async function Home() {
  const aboutUsResult = await fetchPublicAboutUs();
  const publicSectionData = await fetchPublicSectionData();
  const socialMediaResult = await fetchPublicSocialMediaLinks();

  const socialMediaLinks = socialMediaResult.ok
    ? socialMediaResult.socialMediaLinks
    : [];

  const sectionAnchorSx = {
    scrollMarginTop: { xs: "72px", md: "88px" },
  };

  return (
    <Stack sx={{ width: "100%" }}>
      <Box id="home" sx={sectionAnchorSx}>
        <Banner
          bannerData={publicSectionData.banner}
          aboutUs={aboutUsResult.ok ? aboutUsResult.aboutUs : null}
        />
      </Box>
      <Box id="subscription" sx={sectionAnchorSx}>
        <ProjectCatalogue publicSectionData={publicSectionData} />
      </Box>
      <Box id="projects" sx={sectionAnchorSx}>
        <BreakDown projectBreakDowns={publicSectionData.breakdown} />
      </Box>
      <Box id="programs" sx={sectionAnchorSx}>
        <WatchUs videoData={publicSectionData.video} />
      </Box>
      <Box id="about" sx={sectionAnchorSx}>
        <PeopleOpinion commentData={publicSectionData.comment} />
      </Box>
      <Box id="contact" sx={sectionAnchorSx}>
        <NewsFromUs blogData={publicSectionData.blog} />
      </Box>
      <FollowUs socialMediaLinks={socialMediaLinks} />
      <LetUsCallYou />
    </Stack>
  );
}
