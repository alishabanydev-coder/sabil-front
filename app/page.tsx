import { Stack } from "@mui/material";
import Banner from "@/component/home/banner/Banner";
import BreakDown from "@/component/home/breakdown/BreakDown";
import Catalogue from "@/component/home/catalogue/Catalogue";
import OnSubscribtion from "@/component/home/OnSubscribtion/OnSubscribtion";
import WatchUs from "@/component/home/watchUs/WatchUs";
import PeopleOpinion from "@/component/home/peopleOpinion/PeopleOpinion";
import NewsFromUs from "@/component/home/newsFromUs/NewsFromUs";
import FollowUs from "@/component/home/followUs/FollowUs";

export default function Home() {
  return (
    <Stack sx={{ width: "100%", pb: 10 }}>
      <Banner />
      <OnSubscribtion />
      <Catalogue />
      <BreakDown />
      <WatchUs />
      <PeopleOpinion />
      <NewsFromUs />
      <FollowUs />
    </Stack>
  );
}
