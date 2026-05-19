import { Stack } from "@mui/material";
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
import { fetchPublicDonation } from "@/component/admin/services/donationApi";
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
  const donationResult = await fetchPublicDonation();
  const publicSectionData = await fetchPublicSectionData();
  const socialMediaResult = await fetchPublicSocialMediaLinks();

  const socialMediaLinks = socialMediaResult.ok
    ? socialMediaResult.socialMediaLinks
    : [];

  return (
    <Stack sx={{ width: "100%" }}>
      <Banner
        bannerData={publicSectionData.banner}
        aboutUs={aboutUsResult.ok ? aboutUsResult.aboutUs : null}
        donation={donationResult.ok ? donationResult.donation : null}
      />
      <ProjectCatalogue publicSectionData={publicSectionData} />
      <BreakDown projectBreakDowns={publicSectionData.breakdown} />
      <WatchUs videoData={publicSectionData.video} />
      <PeopleOpinion commentData={publicSectionData.comment} />
      <NewsFromUs blogData={publicSectionData.blog} />
      <FollowUs socialMediaLinks={socialMediaLinks} />
      <LetUsCallYou />
    </Stack>
  );
}
