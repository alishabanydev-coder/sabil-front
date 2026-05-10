import { Stack } from "@mui/material";
import Banner from "@/component/home/banner/Banner";
import BreakDown from "@/component/home/breakdown/BreakDown";
import Catalogue from "@/component/home/catalogue/Catalogue";
import OnSubscribtion from "@/component/home/OnSubscribtion/OnSubscribtion";
import WatchUs from "@/component/home/watchUs/WatchUs";
import PeopleOpinion from "@/component/home/peopleOpinion/PeopleOpinion";
import NewsFromUs from "@/component/home/newsFromUs/NewsFromUs";
import FollowUs from "@/component/home/followUs/FollowUs";
import LetUsCallYou from "@/component/home/letUsCallYou/LetUsCallYou";
import {
  fetchPublicAllVideos,
  fetchPublicMainPageLayoutItems,
} from "@/component/admin/services/mainPageLayoutApi";
import { fetchPublicSocialMediaLinks } from "@/component/admin/services/socialMediaApi";

const sections = [
  { name: "banner", title: "Banner", header: "poster", text: "name" },
  {
    name: "projects",
    title: "Subscribtion",
    header: "thumbnail",
    text: "title",
  },
  {
    name: "breakdown",
    title: "Project Breakdowns",
    header: "thumbnail",
    text: "title",
  },
  { name: "video", title: "Watch Us", header: "thumbnail", text: "title" },
  { name: "comment", title: "People Opinion", header: "", text: "username" },
  { name: "blog", title: "Blog", header: "images", text: "title" },
];

const fetchPublicSectionData = async () => {
  const results = await Promise.all(
    sections.map((section) => fetchPublicMainPageLayoutItems(section.name))
  );
  return results;
};

export default async function Home() {
  const publicSectionData = await fetchPublicSectionData();
  const publicAllVideos = await fetchPublicAllVideos();
  const socialMediaResult = await fetchPublicSocialMediaLinks();
  const watchUsVideos =
    publicAllVideos.length > 0 ? publicAllVideos : publicSectionData[3];
  const socialMediaLinks = socialMediaResult.ok ? socialMediaResult.socialMediaLinks : [];

  return (
    <Stack sx={{ width: "100%" }}>
      <Banner bannerData={publicSectionData[0]} />
      <OnSubscribtion projects={publicSectionData[1]} />
      <Catalogue addVideos={watchUsVideos} projectsData={publicSectionData[1]}/>
      <BreakDown projectBreakDowns={publicSectionData[2]} />
      <WatchUs videoData={publicSectionData[3]} />
      <PeopleOpinion commentData={publicSectionData[4]} />
      <NewsFromUs blogData={publicSectionData[5]} />
      <FollowUs socialMediaLinks={socialMediaLinks} />
      <LetUsCallYou />
    </Stack>
  );
}
