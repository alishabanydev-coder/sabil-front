import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import { WatchCatalogueVideo } from "./buildWatchRelatedVideos";

const TitleTextStack = ({
  isOverlay,
  item,
}: {
  isOverlay: boolean;
  item: WatchCatalogueVideo;
}) => {
  const cardProjectLogo = item.projectThumbnail?.trim() || "";
  const cardProjectName = item.projectTitle?.trim() || "Project";

  if (isOverlay) {
    return (
      <Stack
        direction="row"
        sx={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
          alignItems: "center",
          gap: 0.5,
          px: 0.5,
          minHeight: { xs: 25, sm: 25, md: 32 },
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          "& .episode": {
            color: { xs: "#777", sm: "white" },
            fontSize: { xs: 10, sm: 11, md: 14 },
            fontWeight: 400,
          },
          "& .title": {
            fontSize: { xs: 10, sm: 11, md: 14 },
            color: { xs: "primary.light", sm: "white" },
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "50%",
          },
        }}
      >
        {cardProjectLogo ? (
          <Image
            src={cardProjectLogo}
            alt={cardProjectName}
            width={26}
            height={26}
            style={{
              objectFit: "contain",
              borderRadius: "50%",
            }}
          />
        ) : null}
        <Typography className="episode">
          {`S${item.season}-E${item.episode} |`}
        </Typography>

        <Typography className="title">{item.title}</Typography>
      </Stack>
    );
  } else {
    return (
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          gap: 0.5,
          px: 0.5,
          pb: 0.5,
          minHeight: { xs: 28, sm: 32, md: 40 },
        }}
      >
        {cardProjectLogo ? (
          <Image
            src={cardProjectLogo}
            alt={cardProjectName}
            width={28}
            height={28}
            style={{
              objectFit: "contain",
              borderRadius: "50%",
            }}
          />
        ) : null}
        <Typography
          sx={{
            fontSize: { xs: 10, sm: 12, md: 14 },
            fontWeight: 500,
            color: "#777",
          }}
        >
          {`S${item.season}-E${item.episode} |`}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 10, sm: 12, md: 14 },
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "50%",
          }}
        >
          {item.title}
        </Typography>
      </Stack>
    );
  }
};

export default TitleTextStack;
