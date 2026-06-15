"use client";

import { alpha, Stack, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import { PrimaryButton } from "../ui/PrimaryButton";
import OdometerNumber from "./component/OdometerNumber";
import { useInView } from "@/component/donation/hooks/useInViewOnce";

const SQUARE_SIZE = 22;

const donateNowSquareDrift = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(${SQUARE_SIZE}px, ${SQUARE_SIZE}px, 0);
  }
`;

const cornerFadeGradient = (color: string) =>
  `radial-gradient(ellipse 60% 60% at 0% 0%, ${color} 0%, transparent 70%),
   radial-gradient(ellipse 60% 60% at 100% 0%, ${color} 0%, transparent 70%),
   radial-gradient(ellipse 60% 60% at 0% 100%, ${color} 0%, transparent 70%),
   radial-gradient(ellipse 60% 60% at 100% 100%, ${color} 0%, transparent 70%)`;

const PATTERN_CENTER_MASK =
  "radial-gradient(ellipse 55% 50% at 50% 50%, #000 0%, #000 32%, transparent 100%)";

const DonateNow = () => {
  const { ref, inView } = useInView();

  return (
    <Stack ref={ref} sx={{ width: "100%", position: "relative", mt: 5 }}>
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: 16 / 9,
          overflow: "hidden",
          borderRadius: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 1,
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.25),
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: 3,
            backgroundImage: (theme) =>
              cornerFadeGradient(alpha(theme.palette.primary.main, 0.5)),
            pointerEvents: "none",
          },
          "& img": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "rotate(-10deg) scale(1.3)",
            filter: "brightness(0.7)",
          },
        }}
      >
        <img src="/news2.png" alt="donate now" />

        <Stack
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            overflow: "hidden",
            pointerEvents: "none",
            WebkitMaskImage: PATTERN_CENTER_MASK,
            maskImage: PATTERN_CENTER_MASK,
          }}
        >
          <Stack
            sx={{
              position: "absolute",
              top: -SQUARE_SIZE * 2,
              left: -SQUARE_SIZE * 2,
              width: `calc(100% + ${SQUARE_SIZE * 4}px)`,
              height: `calc(100% + ${SQUARE_SIZE * 4}px)`,
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
              `,
              backgroundSize: `${SQUARE_SIZE}px ${SQUARE_SIZE}px`,
              backgroundRepeat: "repeat",
              animation: `${donateNowSquareDrift} 3s linear infinite`,
              willChange: "transform",
            }}
          />
        </Stack>
      </Stack>

      <Stack
        sx={{
          position: "absolute",
          top: { xs: "15%", sm: "20%", md: "25%", lg: "30%" },
          width: "100%",
          mx: "auto",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5, md: 2, lg: 3 },
          zIndex: 100,
        }}
      >
        <Diversity2Icon
          sx={{
            fontSize: { xs: 36, sm: 64, md: 82, lg: 96 },
            color: "warning.main",
          }}
        />
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: 10, sm: 16, md: 26 },
            fontWeight: 500,
            fontFamily: "Namecat",
            color: "warning.main",
            letterSpacing: 3,
            direction: "ltr",
          }}
        >
          <OdometerNumber
            value={200}
            active={inView}
            sx={{
              fontSize: { xs: 10, sm: 16, md: 26 },
              fontWeight: 700,
              fontFamily: "Namecat",
              letterSpacing: 2,
              direction: "ltr",
              color: "warning.main",
            }}
          />
          +
          {" "}
          Donors
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: { xs: 9, sm: 18, md: 28 },
            fontWeight: 700,
            fontFamily: "Namecat",
            color: "warning.main",
            letterSpacing: 1.6,
          }}
        >
          Join Our Comunity Donors
        </Typography>
        <PrimaryButton
          sx={{
            px: { xs: 1.2, sm: 1.5, md: 1.8, lg: 2 },
            py: { xs: 0.5, sm: 1, md: 1, lg: 1.1 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 9, sm: 14, md: 18 },
              fontFamily: "Namecat",
              letterSpacing: 2,
            }}
          >
            Donate Now
          </Typography>
        </PrimaryButton>
      </Stack>
    </Stack>
  );
};

export default DonateNow;
