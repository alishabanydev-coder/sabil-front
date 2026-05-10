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
import { fetchPublicMainPageLayoutItems } from "@/component/admin/services/mainPageLayoutApi";

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
];

const fetchPublicSectionData = async () => {
  const results = await Promise.all(
    sections.map((section) => fetchPublicMainPageLayoutItems(section.name))
  );
  return results;
};

export default async function Home() {
  const publicSectionData = await fetchPublicSectionData();

  console.log(publicSectionData);
  return (
    <Stack sx={{ width: "100%" }}>
      <Banner bannerData={publicSectionData[0]} />
      <OnSubscribtion />
      <Catalogue />
      <BreakDown />
      <WatchUs />
      <PeopleOpinion />
      <NewsFromUs />
      <FollowUs />
      <LetUsCallYou />
    </Stack>
  );
}
