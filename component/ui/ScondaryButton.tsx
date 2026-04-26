"use client";

import { Button, ButtonProps, styled } from "@mui/material";

export const ScondaryButton = styled(
  ({ children, disableRipple, ...otherProps }: ButtonProps) => (
    <Button disableRipple={true} {...otherProps}>
      {children}
    </Button>
  )
)(({ theme }) => ({
  background: theme.palette.warning.main,
  borderRadius: 50,
  border: `5px solid #5e92fc`, //new color
  color: theme.palette.primary.main,
  paddingRight: 25,
  paddingLeft: 25,
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.9)",

  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow:
      "0 4px 8px rgba(0, 0, 0, 0.35), " +
      "2px 2px 4px 0 rgba(0, 0, 0, 0.5), " +
      "-2px -2px 4px 0 rgba(0, 0, 0, 0.3), " +
      "inset -4px -4px 6px 0 rgba(255, 255, 255, 0), " +
      "inset 4px 4px 6px 0 rgba(0, 0, 0, 0.4)",
    transition: "all 0.2s ease",
  },
}));
