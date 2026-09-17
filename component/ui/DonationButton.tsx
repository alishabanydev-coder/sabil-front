"use client";

import { Button, ButtonProps, styled } from "@mui/material";

export const DonationButton = styled(
  ({ children, disableRipple, ...otherProps }: ButtonProps) => (
    <Button disableRipple={true} {...otherProps}>
      {children}
    </Button>
  )
)(({ theme }) => ({
  background: "#feba0d",
  borderRadius: 50,
  border: `1px solid ${"#f7c74d"}`,
  color: theme.palette.warning.main,
  paddingRight: 20,
  paddingLeft: 20,
  boxShadow:
    "0 4px 8px rgba(0, 0, 0, 0.1), " +
    "2px 2px 4px 0 rgba(0, 0, 0, 0.1), " +
    "-2px -2px 4px 0 rgba(0, 0, 0, 0.1), " +
    "inset -4px -4px 6px 0 rgba(255, 255, 255, 0), " +
    "inset 4px 4px 6px 0 rgba(0, 0, 0, 0.1)",
  minHeight: 0,

  [theme.breakpoints.up("md")]: {
    border: `3px solid ${"#f7c74d"}`,
    paddingRight: 25,
    paddingLeft: 25,
  },

  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow:
      "0 4px 8px rgba(0, 0, 0, 0.3), " +
      "2px 2px 4px 0 rgba(0, 0, 0, 0.3), " +
      "-2px -2px 4px 0 rgba(0, 0, 0, 0.3), " +
      "inset -4px -4px 6px 0 rgba(255, 255, 255, 0), " +
      "inset 4px 4px 6px 0 rgba(0, 0, 0, 0.3)",
    transition: "all 0.2s ease",
  },
}));
