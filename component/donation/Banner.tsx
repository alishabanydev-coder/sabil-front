"use client";

import { alpha, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import OdometerNumber from "./component/OdometerNumber";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import VideoSettingsIcon from "@mui/icons-material/VideoSettings";
import { useInView } from "@/component/donation/hooks/useInViewOnce";

const DONATED_TARGET = 1000;
const DONORS_TARGET = 200;
const PROJECTS_TARGET = 10;

const statTypography = {
  fontWeight: 700,
  fontFamily: "Namecat",
  letterSpacing: 2,
  direction: "ltr" as const,
};

const cornerColorGradient = (color: string) =>
  `radial-gradient(ellipse 90% 90% at 100% 0%, ${color} 0%, transparent 50%), radial-gradient(ellipse 90% 90% at 0% 100%, ${color} 0%, transparent 50%)`;

const CORNER_AREA_MASK =
  "radial-gradient(ellipse 90% 90% at 100% 0%, #000 0%, transparent 50%), radial-gradient(ellipse 90% 90% at 0% 100%, #000 0%, transparent 50%)";

const DOT_SIZE = 12;

const donationDotDrift = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(${DOT_SIZE}px, ${DOT_SIZE}px, 0);
  }
`;

const Banner = () => {
  const { ref, inView } = useInView();

  return (
    <Stack
      sx={{
        width: "100%",
      }}
    >
      <Stack ref={ref} sx={{ width: "100%", mx: "auto", position: "relative" }}>
        <Stack
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: 16 / 9,
            backgroundImage: "url(/news1.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.7)",
            borderRadius: 2,
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.38),
              pointerEvents: "none",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage: (theme) =>
                cornerColorGradient(alpha(theme.palette.primary.main, 0.85)),
              pointerEvents: "none",
            },
          }}
        >
          <Stack
            aria-hidden
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              overflow: "hidden",
              WebkitMaskImage: CORNER_AREA_MASK,
              maskImage: CORNER_AREA_MASK,
              WebkitMaskComposite: "source-over",
              maskComposite: "add",
            }}
          >
            <Stack
              sx={{
                position: "absolute",
                top: -DOT_SIZE,
                left: -DOT_SIZE,
                width: `calc(100% + ${DOT_SIZE * 2}px)`,
                height: `calc(100% + ${DOT_SIZE * 2}px)`,
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.6) 1.2px, transparent 1.2px)",
                backgroundSize: `${DOT_SIZE}px ${DOT_SIZE}px`,
                backgroundRepeat: "repeat",
                animation: `${donationDotDrift} 2s linear infinite`,
                willChange: "transform",
              }}
            />
          </Stack>
        </Stack>
        <Stack
          sx={{
            position: "absolute",
            width: "100%",
            top: "40%",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            component="div"
            sx={{
              color: "white",
              fontSize: { xs: 11, sm: 18, md: 45 },
              ...statTypography,
            }}
          >
            more than{" "}
            <OdometerNumber
              value={DONATED_TARGET}
              active={inView}
              sx={{
                fontSize: { xs: 11, sm: 18, md: 45 },
                ...statTypography,
                color: "white",
              }}
            />
            $ donated
          </Typography>

          <Typography
            sx={{
              color: "white",
              fontSize: { xs: 9, sm: 14, md: 18 },
              fontFamily: "Namecat",
              fontWeight: 500,
              letterSpacing: 2,
            }}
          >
            Sabeel is anone profitable organization
          </Typography>
        </Stack>

        <Stack
          sx={{
            position: "absolute",
            bottom: "10%",
            left: { xs: "5%", sm: "10%" },
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              lineHeight: 1,
              color: "warning.main",
              fontSize: { xs: 9, sm: 16, md: 20, lg: 25 },
              ...statTypography,
            }}
          >
            Donors{" "}
            <OdometerNumber
              value={DONORS_TARGET}
              active={inView}
              sx={{
                fontSize: { xs: 9, sm: 16, md: 20, lg: 25 },
                ...statTypography,
                color: "warning.main",
              }}
            />
            +
          </Typography>
          <Diversity3Icon
            sx={{
              fontSize: { xs: 15, sm: 25, md: 32, lg: 36 },
              color: "warning.main",
              mb: 0.7,
            }}
          />
        </Stack>
        <Stack
          sx={{
            position: "absolute",
            bottom: "10%",
            right: { xs: "5%", sm: "10%" },
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              color: "warning.main",
              fontSize: { xs: 9, sm: 16, md: 20, lg: 25 },
              ...statTypography,
            }}
          >
            Projects{" "}
            <OdometerNumber
              value={PROJECTS_TARGET}
              active={inView}
              sx={{
                fontSize: { xs: 9, sm: 16, md: 20, lg: 25 },
                ...statTypography,
                color: "warning.main",
              }}
            />
            +
          </Typography>
          <VideoSettingsIcon
            sx={{
              fontSize: { xs: 15, sm: 25, md: 32, lg: 36 },
              color: "warning.main",
              mb: 0.7,
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Banner;
