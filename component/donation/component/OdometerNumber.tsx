"use client";

import { Box, type SxProps, type Theme } from "@mui/material";
import { useMemo } from "react";

const DEFAULT_CYCLES = 2;

type OdometerDigitProps = {
  targetDigit: number;
  active: boolean;
  duration: number;
  delay: number;
  sx?: SxProps<Theme>;
};

function OdometerDigit({
  targetDigit,
  active,
  duration,
  delay,
  sx,
}: OdometerDigitProps) {
  const totalSteps = DEFAULT_CYCLES * 10 + targetDigit;
  const digits = useMemo(
    () => Array.from({ length: totalSteps + 1 }, (_, index) => index % 10),
    [totalSteps]
  );

  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        height: "1em",
        overflow: "hidden",
        verticalAlign: "baseline",
        position: "relative",
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          height: "18%",
          zIndex: 1,
          pointerEvents: "none",
        },
        "&::before": {
          top: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.22), transparent)",
        },
        "&::after": {
          bottom: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.22), transparent)",
        },
      }}
    >
      <Box
        component="span"
        sx={{
          display: "block",
          transform: active ? `translateY(-${totalSteps}em)` : "translateY(0)",
          transition: active
            ? `transform ${duration}ms cubic-bezier(0.12, 0.85, 0.18, 1) ${delay}ms`
            : "none",
          willChange: "transform",
        }}
      >
        {digits.map((digit, index) => (
          <Box
            component="span"
            key={index}
            sx={{
              display: "block",
              height: "1em",
              lineHeight: 1,
              ...sx,
            }}
          >
            {digit}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

type OdometerNumberProps = {
  value: number;
  active: boolean;
  duration?: number;
  digitDelay?: number;
  sx?: SxProps<Theme>;
};

export default function OdometerNumber({
  value,
  active,
  duration = 2400,
  digitDelay = 110,
  sx,
}: OdometerNumberProps) {
  const characters = value.toLocaleString("en-US").split("");

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "baseline",
        direction: "ltr",
      }}
    >
      {characters.map((character, index) => {
        if (character === ",") {
          return (
            <Box component="span" key={`comma-${index}`} sx={sx}>
              ,
            </Box>
          );
        }

        const targetDigit = Number(character);
        const digitIndexFromRight = characters.length - 1 - index;

        return (
          <OdometerDigit
            key={`digit-${index}-${value}`}
            targetDigit={targetDigit}
            active={active}
            duration={duration}
            delay={digitIndexFromRight * digitDelay}
            sx={sx}
          />
        );
      })}
    </Box>
  );
}
