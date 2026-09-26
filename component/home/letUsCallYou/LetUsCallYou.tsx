"use client";

import { Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { AppButton } from "@/component/ui/AppButton";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import FollowUsModal from "./component/LetUsCallModal";
import { useState } from "react";
import SeactionHeader from "@/component/ui/SectionHeader";

const whiteTextFieldStyles = {
  "& .MuiInputLabel-root": {
    color: "#fff",
    fontFamily: "Namecat",
    fontSize: { xs: 8, sm: 11, md: 13, lg: 14 },
    letterSpacing: 1.2,
  },
  "& .MuiInputLabel-standard": {
    transform: {
      xs: "translate(0, 32px) scale(1)",
      sm: "translate(0, 24px) scale(1)",
    },
  },
  "& .MuiInputLabel-standard.MuiInputLabel-shrink": {
    transform: "translate(0, -2px) scale(0.75)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff",
    fontFamily: "Namecat",
  },
  "& .MuiInputBase-input": {
    color: "#fff",
    fontFamily: "Namecat",
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "#fff",
  },
  "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottomColor: "#fff",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#fff",
  },
  "& .MuiFormHelperText-root": {
    display: { xs: "none", sm: "block" },
    color: "#fff",
    fontFamily: "Namecat",
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "light",
    mt: 1.5,
  },
};

const LetUsCallYou = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Stack
        sx={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          mt: { xs: -5, sm: -10, md: -20 },
        }}
      >
        <Stack
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: { xs: "16 / 11", sm: "16 / 9" },
            "& img": {
              objectFit: { xs: "fill", md: "contain" },
            },
          }}
        >
          <Image src="/let-us-call-you-background.webp" alt="logo" fill />
        </Stack>
        <Stack
          direction="row"
          sx={{
            width: "80%",
            mx: "auto",
            position: "absolute",
            top: { xs: "30%", sm: "38%" },
            gap: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              width: "55%",
              direction: "ltr",
              alignItems: "center",
              gap: 2,
              pb: 2,
            }}
          >
            <Stack direction="row" sx={{ gap: 2 }}>
              <TextField
                onClick={() => setOpen(true)}
                variant="standard"
                label="YOUR NAME AND SURENAME"
                sx={whiteTextFieldStyles}
                helperText="THIS FIELD IS REQUIRED!"
              />
              <TextField
                onClick={() => setOpen(true)}
                variant="standard"
                label="YOUR GSM NUMBER"
                sx={whiteTextFieldStyles}
                helperText="THIS FIELD IS REQUIRED!"
              />
            </Stack>

            <AppButton
              tone="secondary"
              sx={{
                width: { xs: "100%", sm: "auto" },
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                px: { xs: 0.7, sm: 2.4 },
                py: { xs: 0.3, sm: 1 },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 10, md: 16, lg: 18 },
                  fontFamily: "Namecat",
                  letterSpacing: 2,
                  mt: 0.5,
                }}
              >
                SEND
              </Typography>
              <Stack
                sx={{
                  bgcolor: "secondary.main",
                  borderRadius: "50%",
                  p: 0.1,
                }}
              >
                <PlayArrowRoundedIcon
                  sx={{ color: "primary.main", fontSize: { xs: 15, sm: 20 } }}
                />
              </Stack>
            </AppButton>
          </Stack>

          <Stack
            sx={{
              direction: "ltr",
              width: "45%",
              gap: { xs: 1, sm: 2 },
              pl: { xs: 0, sm: 5 },
              pr: { xs: 0, sm: 4 },
            }}
          >
            <SeactionHeader
              text="Let Us Call You"
              sx={{
                textAlign: "start",
                color: "#fff",
                fontSize: { xs: 11, sm: 16, md: 24 },
              }}
            />

            <Typography
              sx={{
                fontSize: { xs: 8, sm: 12, md: 18 },
                color: "secondary.main",
                fontFamily: "Namecat",
              }}
            >
              If you would like to receive information about animation and
              content production and support for Sebeel Kids, please enter your
              contact information.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <FollowUsModal open={open} onClose={handleClose} />
    </>
  );
};

export default LetUsCallYou;
