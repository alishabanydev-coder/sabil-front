import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import Image from "next/image";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";

const CYAN_U = "#2ee6f0";
const COSINE_DENT = 0.1;
const COSINE_SAMPLES = 48;
const POSTER_WIDTH = 0.68;

const stackStyles = {
  width: "fit-content",
  px: { xs: 0.5, sm: 1, md: 2 },
  py: { xs: 0.3, sm: 0.5, md: 1 },
  bgcolor: "#fff",
  borderRadius: 3,
  textAlign: "center",
  color: "secondary.main",
  fontSize: { xs: 9, sm: 12, md: 12, lg: 16, xl: 18 },
  fontFamily: "Namecat",
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  letterSpacing: 1,
  fontWeight: 100,
  flexShrink: 0,
};

function cosineRibbonPathUpsideDown(dent: number, samples: number) {
  const top: string[] = [];
  const bottom: string[] = [];

  for (let index = 0; index <= samples; index += 1) {
    const x = index / samples;
    const wave = dent * Math.pow(Math.sin(Math.PI * x), 0.9);
    top.push(`${x.toFixed(5)},${(dent - wave).toFixed(5)}`);
    bottom.push(`${x.toFixed(5)},${(1 - wave).toFixed(5)}`);
  }

  return `M ${top.join(" L ")} L ${bottom.reverse().join(" L ")} Z`;
}

const COSINE_CLIP_PATH = cosineRibbonPathUpsideDown(
  COSINE_DENT,
  COSINE_SAMPLES
);

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  INR: "₹",
};

const AMOUNT_UNITS = [
  { threshold: 1_000_000_000_000, suffix: "tril" },
  { threshold: 1_000_000_000, suffix: "bil" },
  { threshold: 1_000_000, suffix: "mil" },
  { threshold: 1_000, suffix: "k" },
];

function compactAmount(value: number) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "0";

  const sign = amount < 0 ? "-" : "";
  const absolute = Math.abs(amount);

  for (const unit of AMOUNT_UNITS) {
    if (absolute >= unit.threshold) {
      const scaled = absolute / unit.threshold;
      const rounded = scaled >= 100 ? scaled.toFixed(0) : scaled.toFixed(1);
      return `${sign}${rounded.replace(/\.0$/, "")}${unit.suffix}`;
    }
  }

  return `${sign}${Math.round(absolute)}`;
}

type DonationProject = {
  _id: string;
  title: string;
  slug: string;
  poster: string;
  shortDescription: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  currency?: "USD" | "INR" | string;
  videoUrl?: string | null;
  status: string;
};

const DonationProjectBanner = ({
  projectData,
}: {
  projectData: DonationProject;
}) => {
  console.log(projectData);
  const raisedProgress =
    projectData.goalAmount > 0
      ? Math.min(100, (projectData.raisedAmount / projectData.goalAmount) * 100)
      : 0;

  return (
    <Stack
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: { xs: "16 / 9", sm: "16 / 7.2" },
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        mt: { xs: 1.5, sm: 2, md: 2.5 },
      }}
    >
      <svg aria-hidden width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath
            id="donation-project-banner-cosine-u"
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
          position: "relative",
          bgcolor: CYAN_U,
          overflow: "hidden",
          clipPath: "url(#donation-project-banner-cosine-u)",
          WebkitClipPath: "url(#donation-project-banner-cosine-u)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack sx={{ width: "100%", height: "100%", justifyContent: "center" }}>
          <Stack
            sx={{
              height: "90%",
              width: { xs: "45%", sm: "40%", md: "38%", lg: "40%", xl: "45%" },
              position: "absolute",
              top: "10%",
              left: { xs: "3%", sm: "5%" },
              zIndex: 2,
            }}
          >
            <Stack
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack
                sx={{
                  position: "absolute",
                  top: {
                    xs: "10%",
                    sm: "15%",
                    md: "16%",
                    lg: "15%",
                    xl: "18%",
                  },
                  left: { xs: "3%", sm: "5%" },
                  flexDirection: "column",
                  textAlign: "start",
                  direction: "ltr",
                  "& p": {
                    fontSize: { xs: 13, sm: 16, md: 28, lg: 36, xl: 38 },
                    fontFamily: "Arco",
                    lineHeight: 1,
                    whiteSpace: "pre-line",
                    letterSpacing: 1,
                  },
                  "& span": {
                    pt: { xs: 1, lg: 2 },
                    fontSize: { xs: 10, sm: 13, md: 18, lg: 20, xl: 22 },
                    fontFamily: "Namecat",
                    lineHeight: 1.1,
                    whiteSpace: "pre-line",
                    letterSpacing: 1,
                    fontWeight: 100,
                    WebkitLineClamp: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                  },
                }}
              >
                <Typography color="primary">{projectData.title}</Typography>

                <Typography
                  component={"span"}
                  sx={{
                    unicodeBidi: "isolate",
                    color: "#fff",
                  }}
                >
                  {projectData.shortDescription}
                </Typography>
              </Stack>

              <Stack
                direction="row"
                sx={{
                  flexWrap: "wrap",
                  gap: { xs: 1, lg: 2 },
                  position: "absolute",
                  bottom: {
                    xs: "22%",
                    sm: "22%",
                    md: "30%",
                    lg: "28%",
                    xl: "30%",
                  },
                  left: { xs: "3%", sm: "5%" },
                  zIndex: 100,
                  justifyContent: "start",
                }}
              >
                <Stack sx={stackStyles}>{projectData.status}</Stack>
                <Stack
                  sx={stackStyles}
                >{`${projectData.donorCount} Donors`}</Stack>
                <Stack sx={stackStyles}>{`${
                  CURRENCY_SYMBOLS[projectData.currency ?? "USD"] ?? "$"
                }${compactAmount(projectData.raisedAmount)} raised`}</Stack>
              </Stack>
            </Stack>
          </Stack>

          {projectData.poster ? (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: `${POSTER_WIDTH * 100}%`,
                height: "100%",
                zIndex: 1,
                clipPath: "url(#donation-banner-poster-slice)",
                WebkitClipPath: "url(#donation-banner-poster-slice)",
                "& .swiper, & .swiper-wrapper, & .swiper-slide": {
                  width: "100%",
                  height: "100%",
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, #000 32%, #000 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, #000 32%, #000 100%)",
                  maskSize: "100% 100%",
                  WebkitMaskSize: "100% 100%",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                }}
              >
                <Image
                  src={projectData.poster}
                  alt={projectData.title}
                  fill
                  priority
                  sizes="100%"
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Box>
          ) : null}
        </Stack>
      </Stack>

      <Stack
        sx={{
          position: "absolute",
          bottom: {
            xs: "-25%",
            sm: "-20%",
            md: "-13%",
            lg: "-15%",
            xl: "-8%",
          },
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "85%", sm: "80%", md: "70%" },
          height: "auto",
          mx: "auto",
          bgcolor: "background.paper",
          boxShadow: 3,
          p: { xs: 1.8, md: 3, lg: 4 },
          px: 4,
          borderRadius: { xs: 3, md: 8 },
          zIndex: 100,
        }}
      >
        <Stack
          sx={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: { xs: 0.8, sm: 1.5, md: 2.5, lg: 3.5, xl: 4 },
          }}
        >
          <Stack sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 20, md: 30, lg: 36, xl: 38 },
                fontWeight: 700,
                fontFamily: "Arco",
                lineHeight: 1.2,
                letterSpacing: 1,
                color: "primary.main",
              }}
            >
              {`${CURRENCY_SYMBOLS[projectData.currency ?? "USD"] ?? "$"}`}
              {projectData.raisedAmount}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 10, sm: 13, md: 18, lg: 20, xl: 22 },
                fontFamily: "Namecat",
                lineHeight: 1.2,
                whiteSpace: "pre-line",
                letterSpacing: 1,
              }}
            >
              Raised
            </Typography>
          </Stack>

          <Box sx={{ position: "relative", flex: 1, alignSelf: "center" }}>
            <LinearProgress
              variant="determinate"
              value={raisedProgress}
              sx={{
                height: { xs: 8, sm: 10, md: 12, lg: 14, xl: 16 },
                borderRadius: 10,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: `${raisedProgress}%`,
                transform: `translate(-${raisedProgress}%, -50%)`,
                minWidth: { xs: 28, sm: 34, md: 40 },
                height: { xs: 38, sm: 45, md: 56, lg: 65, xl: 75 },
                aspectRatio: 1,
                px: 0.6,
                borderRadius: 999,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                border: "3px solid",
                borderColor: "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Namecat",
                fontSize: { xs: 10, sm: 12, md: 16, lg: 20, xl: 22 },
                lineHeight: 1,
                zIndex: 1,
              }}
            >
              {Math.round(raisedProgress)} %
            </Box>
          </Box>

          <Stack sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 20, md: 30, lg: 36, xl: 38 },

                fontWeight: 700,
                fontFamily: "Arco",
                lineHeight: 1.2,
                letterSpacing: 1,
                color: "primary.main",
              }}
            >
              {`${CURRENCY_SYMBOLS[projectData.currency ?? "USD"] ?? "$"}`}

              {projectData.goalAmount}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 10, sm: 13, md: 18, lg: 20, xl: 22 },
                fontFamily: "Namecat",
                lineHeight: 1.2,
                whiteSpace: "pre-line",
                letterSpacing: 1,
              }}
            >
              Goal
            </Typography>
          </Stack>

          <Button
            variant="contained"
            disableRipple   
            sx={{
              bgcolor: "#FF4C62",
              color: "#fff",
              px: { xs: 0.5, sm: 1, md: 1.4, lg: 1.6, xl: 2 },
              py: { xs: 0.5, sm: 1, md: 1.4, lg: 1.6, xl: 2 },
              gap: { xs: 0.4, sm: 0.6, md: 1 },
              minWidth: 0,
              borderRadius: { xs: "50%", sm: 3 },
              "& p": {
                fontFamily: "Namecat",
                fontSize: { xs: 12, sm: 13, md: 16, lg: 19, xl: 22 },
                lineHeight: 1.2,
                letterSpacing: 1,
                display: { xs: "none", sm: "block" },
              },
              "& svg": { fontSize: { xs: 22, sm: 18, md: 24, lg: 28, xl: 32 } },
            }}
          >
            <FavoriteBorderRoundedIcon />
            <Typography>Donate Now</Typography>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DonationProjectBanner;
