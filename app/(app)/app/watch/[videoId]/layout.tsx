import { Stack } from "@mui/material";
import WatchNabar from "@/component/appCatalogue/watch/WatchNabar";

const WatchLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack sx={{ height: "100%", position: "relative", direction: "ltr" }}>
      <WatchNabar />
      {children}
    </Stack>
  );
};

export default WatchLayout;
