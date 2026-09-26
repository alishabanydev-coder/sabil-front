"use client";

import { Button, ButtonProps, styled, Theme } from "@mui/material";

export type AppButtonTone = "primary" | "secondary" | "donation" | "white";

export type AppButtonShadow = "hard" | "soft";

type ToneStyle = {
  background: string;
  borderColor: string;
  color: string;
  shadow: AppButtonShadow;
  /** Border width in px, as [mobile, desktop]. */
  borderWidth: [number, number];
  /** Horizontal padding in px, as [mobile, desktop]. */
  paddingX: [number, number];
  /** Breakpoint at which the desktop values kick in. */
  breakpoint: "sm" | "md";
};

const SHADOWS: Record<AppButtonShadow, { rest: string; hover: string }> = {
  hard: {
    rest: "0px 2px 4px rgba(0, 0, 0, 0.9)",
    hover:
      "0 4px 8px rgba(0, 0, 0, 0.35), " +
      "2px 2px 4px 0 rgba(0, 0, 0, 0.5), " +
      "-2px -2px 4px 0 rgba(0, 0, 0, 0.3), " +
      "inset -4px -4px 6px 0 rgba(255, 255, 255, 0), " +
      "inset 4px 4px 6px 0 rgba(0, 0, 0, 0.4)",
  },
  soft: {
    rest:
      "0 4px 8px rgba(0, 0, 0, 0.1), " +
      "2px 2px 4px 0 rgba(0, 0, 0, 0.1), " +
      "-2px -2px 4px 0 rgba(0, 0, 0, 0.1), " +
      "inset -4px -4px 6px 0 rgba(255, 255, 255, 0), " +
      "inset 4px 4px 6px 0 rgba(0, 0, 0, 0.1)",
    hover:
      "0 4px 8px rgba(0, 0, 0, 0.3), " +
      "2px 2px 4px 0 rgba(0, 0, 0, 0.3), " +
      "-2px -2px 4px 0 rgba(0, 0, 0, 0.3), " +
      "inset -4px -4px 6px 0 rgba(255, 255, 255, 0), " +
      "inset 4px 4px 6px 0 rgba(0, 0, 0, 0.3)",
  },
};

const BASE_SHAPE: Pick<
  ToneStyle,
  "shadow" | "borderWidth" | "paddingX" | "breakpoint"
> = {
  shadow: "hard",
  borderWidth: [2, 3],
  paddingX: [20, 25],
  breakpoint: "md",
};

const getToneStyle = (theme: Theme, tone: AppButtonTone): ToneStyle => {
  switch (tone) {
    case "secondary":
      return {
        ...BASE_SHAPE,
        background: theme.palette.warning.main,
        borderColor: "#5e92fc",
        color: theme.palette.primary.main,
        borderWidth: [3, 5],
        paddingX: [25, 25],
        breakpoint: "sm",
      };
    case "donation":
      return {
        ...BASE_SHAPE,
        background: "#feba0d",
        borderColor: "#f7c74d",
        color: theme.palette.warning.main,
        shadow: "soft",
      };
    case "white":
      return {
        ...BASE_SHAPE,
        background: "#ffffff",
        borderColor: "#b6b8ba",
        color: theme.palette.warning.main,
      };
    case "primary":
    default:
      return {
        ...BASE_SHAPE,
        background: theme.palette.primary.main,
        borderColor: theme.palette.secondary.main,
        color: theme.palette.warning.main,
      };
  }
};

export type AppButtonProps = ButtonProps & {
  tone?: AppButtonTone;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  shadow?: AppButtonShadow;
};

export const AppButton = styled(
  ({
    children,
    disableRipple,
    tone,
    bgColor,
    borderColor,
    textColor,
    shadow,
    ...otherProps
  }: AppButtonProps) => (
    <Button disableRipple={true} {...otherProps}>
      {children}
    </Button>
  )
)(({ theme, tone = "primary", bgColor, borderColor, textColor, shadow }) => {
  const style = getToneStyle(theme, tone);
  const shadows = SHADOWS[shadow ?? style.shadow];
  const stroke = borderColor ?? style.borderColor;

  return {
    background: bgColor ?? style.background,
    color: textColor ?? style.color,
    border: `${style.borderWidth[0]}px solid ${stroke}`,
    borderRadius: 50,
    paddingLeft: style.paddingX[0],
    paddingRight: style.paddingX[0],
    boxShadow: shadows.rest,
    minHeight: 0,

    [theme.breakpoints.up(style.breakpoint)]: {
      border: `${style.borderWidth[1]}px solid ${stroke}`,
      paddingLeft: style.paddingX[1],
      paddingRight: style.paddingX[1],
    },

    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: shadows.hover,
      transition: "all 0.2s ease",
    },
  };
});
