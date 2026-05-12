import { IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import followUsImage from "@/public/follow-us.png";
import youtubeIcon from "@/public/youtube-icon.png";
import xIcon from "@/public/x-icon.png";
import instagramIcon from "@/public/insta-icon.png";
import facebookIcon from "@/public/facebook-icon.png";
import kidsGroup from "@/public/follow-us-image.png";
import SeactionHeader from "@/component/ui/SectionHeader";

const fallbackIcons = [
  { id: 1, name: "youtube", icon: youtubeIcon },
  { id: 4, name: "facebook", icon: facebookIcon },
  { id: 3, name: "instagram", icon: instagramIcon },
  { id: 2, name: "x", icon: xIcon },
];

type SocialMediaLink = {
  _id?: string;
  name?: string;
  url?: string;
  icon?: string;
};

const FollowUs = ({
  socialMediaLinks = [],
}: {
  socialMediaLinks?: SocialMediaLink[];
}) => {
  const icons =
    socialMediaLinks.length > 0
      ? socialMediaLinks
          .filter((item) => typeof item?.icon === "string" && item.icon)
          .map((item, index) => ({
            id: item._id || index,
            name: item.name || "social-media",
            icon: item.icon as string,
            url: item.url || "#",
          }))
      : fallbackIcons.map((item) => ({
          ...item,
          url: "#",
        }));

  return (
    <Stack
      sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
    >
      <Stack
        sx={{
          position: "relative",
          width: "95%",
          aspectRatio: "16 / 8",
          mt: 15,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src={followUsImage}
          alt="follow us"
          fill
          style={{ objectFit: "fill" }}
        />

        <Stack
          sx={{
            position: "absolute",
            top: "30%",
            left: "11%",
            direction: "ltr",
            gap: 3,
            width: "40%",
          }}
        >
          <SeactionHeader text="Follow Us"  sx={{textAlign: "start"}}/>
        
          <Typography sx={{ fontSize: 24, color: "success.main", fontFamily: "Namecat" }}>
            you can follow our projects on social networks youtube, X, instagram
            and Facebook
          </Typography>
          <Stack direction="row" sx={{ gap: 2, pl: 1 }}>
            {icons.map((icon) => (
              <IconButton
                key={icon.id}
                component="a"
                href={icon.url}
                target="_blank"
                rel="noreferrer"
                sx={{
                  width: 40,
                  height: 32,
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <Image
                  src={icon.icon}
                  alt={icon.name}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </IconButton>
            ))}
          </Stack>
        </Stack>

        <Stack
          sx={{
            position: "absolute",
            top: "10% ",
            right: "5%",
            width: "44%",
            aspectRatio: "5 / 4",
          }}
        >
          <Image
            src={kidsGroup}
            alt="follow us"
            fill
            style={{ objectFit: "contain" }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default FollowUs;
