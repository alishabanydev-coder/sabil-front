import { IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import SeactionHeader from "@/component/ui/SectionHeader";

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
  const icons = socialMediaLinks
    .filter((item) => typeof item?.icon === "string" && item.icon)
    .map((item, index) => ({
      id: item._id || index,
      name: item.name || "social-media",
      icon: item.icon as string,
      url: item.url || "#",
    }));

  return (
    <Stack
      sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}
    >
      <Stack
        sx={{
          position: "relative",
          width: "95%",
          aspectRatio: { xs: "16 / 13", sm: "16 / 8" },
          mt: { xs: 8, sm: 15 },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="/follow-us.webp"
          alt="follow us"
          fill
          style={{ objectFit: "fill" }}
        />

        <Stack
          sx={{
            position: "absolute",
            top: { xs: "24%", sm: "30%" },
            left: "11%",
            direction: "ltr",
            gap: { xs: 1.8, sm: 3 },
            width: "40%",
          }}
        >
          <SeactionHeader
            text="Follow Us"
            sx={{ textAlign: "start", fontSize: { xs: 15, sm: 16, md: 24 } }}
          />

          <Typography
            sx={{
              fontSize: { xs: 10, sm: 12, md: 24 },
              color: "success.main",
              fontFamily: "Namecat",
            }}
          >
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
                  width: { xs: 30, sm: 40 },
                  height: { xs: 20, sm: 32 },
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
            top: { xs: "25%", sm: "10%" },
            right: "5%",
            width: "44%",
            aspectRatio: "5 / 4",
          }}
        >
          <Image
            src="/follow-us-image.webp"
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
