"use client";

import WatchPage from "@/component/appCatalogue/watch/WatchPage";
import { useParams } from "next/navigation";

const WatchRoutePage = () => {
  const params = useParams();
  const videoId = params.videoId as string;

  return <WatchPage videoId={videoId} />;
};

export default WatchRoutePage;
