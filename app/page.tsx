import Banner from "@/component/home/banner/Banner";
import BreakDown from "@/component/home/breakdown/BreakDown";
import Catalogue from "@/component/home/catalogue/Catalogue";
import OnSubscribtion from "@/component/home/OnSubscribtion/OnSubscribtion";
import { Stack, Typography } from "@mui/material";
import WatchUs from "@/component/home/watchUs/WatchUs";

export default function Home() {
  return (
    <Stack sx={{ width: "100%", pb: 10 }}>
      <Banner />
      <OnSubscribtion />
      <Catalogue />
      <BreakDown />
      <WatchUs />
    </Stack>
  );
}
