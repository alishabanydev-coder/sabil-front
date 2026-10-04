"use client";

import { IconButton, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { AppButton } from "@/component/ui/AppButton";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { useState } from "react";
import FollowUsModal from "../letUsCallYou/component/LetUsCallModal";

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
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const icons = socialMediaLinks
    .filter((item) => typeof item?.icon === "string" && item.icon)
    .map((item, index) => ({
      id: item._id || index,
      name: item.name || "social-media",
      icon: item.icon as string,
      url: item.url || "#",
    }));

  return (
    <>
      <Stack
        sx={{
          direction: "ltr",
          width: { xs: "96%", sm: "95%" },
          mx: "auto",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            aspectRatio: "748 / 375",
            backgroundImage: `url(/connect-with-us.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Stack
            sx={{
              width: { xs: "96%", md: "85%", xl: "70%" },
              height: "100%",
              direction: "ltr",
              justifyContent: { xs: "space-around", lg: "start" },
              alignItems: "start",
              gap: { xs: "auto", lg: 2 },
              px: { xs: 2, sm: 4, lg: 5, xl: 6 },
              pt: { xs: 4, sm: 2.5, md: 4, lg: 5, xl: 6 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Arco",
                lineHeight: 1.2,
                minHeight: 30,
                color: "primary.main",
                fontSize: { xs: 18, sm: 20, md: 28, lg: 36, xl: 45 },
              }}
            >
              Connect with us online
            </Typography>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "block", md: "block" },
                fontFamily: "Namecat",
                lineHeight: 1.2,
                color: "text.primary",
                fontSize: { xs: 10, sm: 12, md: 14, lg: 18, xl: 22 },
              }}
            >
              join our community on social media for fun updates, behind the
              scenes, and more.
            </Typography>
            <Stack
              sx={{
                flexDirection: "row",
                gap: 1,
                "& img": {
                  objectFit: "contain",
                  width: { xs: 36, sm: 38, md: 42, lg: 52, xl: 62 },
                  height: { xs: 36, sm: 38, md: 42, lg: 52, xl: 62 },
                },
              }}
            >
              {icons.map((item) => (
                <IconButton key={item.id} href={item.url} target="_blank">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={24}
                    height={24}
                  />
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Stack>
        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            alignItems: "start",
            aspectRatio: "748 / 375",
            backgroundImage: `url(/lets-talk-background.png)`,
            backgroundSize: { xs: "contain", sm: "cover" },
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Stack
            sx={{
              width: { xs: "100%", md: "85%", xl: "70%" },
              height: "100%",
              direction: "ltr",
              justifyContent: "start",
              alignItems: "start",
              gap: { xs: "auto", lg: 2 },
              px: { xs: 2, sm: 4, lg: 5, xl: 6 },
              pt: { xs: 1, sm: 2, md: 2.5, lg: 3, xl: 5 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Bhel Puri",
                lineHeight: 1.2,
                minHeight: 30,
                color: "#fff",
                fontSize: { xs: 20, sm: 24, md: 28, lg: 42, xl: 50 },
              }}
            >
              Let's Talk
            </Typography>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", md: "block" },
                fontFamily: "Namecat",
                lineHeight: 1.2,
                color: "#fff",
                fontSize: { xs: 10, sm: 12, md: 14, lg: 18, xl: 22 },
              }}
            >
              Have a Question or want to partner with us? We'd love to hear from
              you.
            </Typography>
            <Stack
              sx={{
                width: "100%",
                height: { xs: "90%", sm: "auto" },
                gap: { xs: 0.5, sm: 1, lg: 1.5, xl: 2 },
                zIndex: 100,
                justifyContent: { xs: "space-between", sm: "start" },
                py: "3%",
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  color: "primary.main",
                  borderRadius: 2,
                  minHeight: { xs: 30, sm: 34, md: 38 },
                  flexShrink: 0,
                  "& fieldset": {
                    borderColor: "primary.main",
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                  "& fieldset legend": {
                    display: "none",
                  },
                },
                "& .MuiOutlinedInput-input, & .MuiInputBase-inputSizeSmall": {
                  color: "primary.main",
                  height: "auto",
                  paddingTop: { xs: 0.5, sm: 0.8, md: 1 },
                  paddingBottom: { xs: 0.5, sm: 0.8, md: 1 },
                  "&::placeholder": {
                    color: "#9a9a9a",
                    opacity: 1,
                  },
                },
              }}
            >
              <Stack
                sx={{
                  flexDirection: "row",
                  gap: { xs: 0.5, sm: 1, lg: 1.5 },
                }}
              >
                <TextField
                  placeholder="Name"
                  variant="outlined"
                  onClick={() => setOpen(true)}
                  size="small"
                  fullWidth
                />
                <TextField
                  placeholder="Email"
                  variant="outlined"
                  onClick={() => setOpen(true)}
                  size="small"
                  fullWidth
                />
              </Stack>
              <Stack>
                <TextField
                  placeholder="Email"
                  variant="outlined"
                  onClick={() => setOpen(true)}
                  size="small"
                  fullWidth
                />
              </Stack>
              <AppButton
                tone="donation"
                onClick={() => setOpen(true)}
                sx={{
                  width: "fit-content",
                  maxWidth: "100%",
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  position: "relative",
                  color: "primary.main",
                  fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 },
                }}
              >
                send Message
                <Stack
                  sx={{
                    height: "100%",
                    aspectRatio: "1 / 1",
                    bgcolor: "secondary.main",
                    borderRadius: "50%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PlayArrowRoundedIcon sx={{ color: "#fff", fontSize: 18 }} />
                </Stack>
              </AppButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <FollowUsModal open={open} onClose={handleClose} />
    </>
  );
};

export default FollowUs;
