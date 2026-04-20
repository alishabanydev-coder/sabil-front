import Banner from "@/component/home/banner/Banner";
import Catalogue from "@/component/home/catalogue/Catalogue";
import OnSubscribtion from "@/component/home/OnSubscribtion/OnSubscribtion";
import { Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Stack sx={{ width: "100%", pb: 10 }}>
      <Banner />
      <OnSubscribtion />
      <Catalogue />
    </Stack>
  );
}
