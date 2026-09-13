"use client";

import { Stack } from "@mui/material";
import Banner from "@/component/donation/Banner";

const CYAN_U = "#2ee6f0";
const COSINE_DENT = 0.1;
const COSINE_SAMPLES = 48;

function cosineRibbonPath(dent: number, samples: number) {
  const top: string[] = [];
  const bottom: string[] = [];

  for (let index = 0; index <= samples; index += 1) {
    const x = index / samples;
    const wave = dent * Math.pow(Math.sin(Math.PI * x), 0.9);
    top.push(`${x.toFixed(5)},${wave.toFixed(5)}`);
    bottom.push(`${x.toFixed(5)},${(1 - dent + wave).toFixed(5)}`);
  }

  return `M ${top.join(" L ")} L ${bottom.reverse().join(" L ")} Z`;
}

const COSINE_CLIP_PATH = cosineRibbonPath(COSINE_DENT, COSINE_SAMPLES);

const DonationBanner = () => {
  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        height: "75vh",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        mt: -1
      }}
    >
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath
            id="donation-banner-cosine-u"
            clipPathUnits="objectBoundingBox"
          >
            <path d={COSINE_CLIP_PATH} />
          </clipPath>
        </defs>
      </svg>

      <Stack
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: CYAN_U,
          overflow: "hidden",
          clipPath: "url(#donation-banner-cosine-u)",
          WebkitClipPath: "url(#donation-banner-cosine-u)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          sx={{ width: "100%", height: "100%", justifyContent: "center" }}
        ></Stack>
      </Stack>
      <Stack
        sx={{
          position: "absolute",
          bottom: -40,
          width: "70%",
          mx: "auto",
          height: 150,
          bgcolor: "white",
          border: (theme) => `1px solid ${theme.palette.secondary.main}`,
          borderRadius: 8,
        }}
      ></Stack>
    </Stack>
  );
};

export default DonationBanner;
