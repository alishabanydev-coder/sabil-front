"use client";

import { Button, ButtonProps, styled } from "@mui/material";

export const PrimaryButton = styled(
  ({ children, disableRipple, ...otherProps }: ButtonProps) => (
    <Button disableRipple={true} {...otherProps}>
      {children}
    </Button>
  )
)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: 50,
  border: `5px solid ${theme.palette.secondary.main}`,
  color: theme.palette.warning.main,
  paddingRight: 45,
  paddingLeft: 45,
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.9)",

  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0px 3px 5px rgba(0, 0, 3, 0.7)",
    transition: "all .2s ease",
  },
}));
