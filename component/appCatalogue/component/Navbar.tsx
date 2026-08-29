"use client";

import { useMediaQuery, useTheme } from "@mui/material";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import type { NavbarProps } from "./navbarTypes";

const Navbar = (props: NavbarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return <NavbarMobile {...props} />;
  }

  return <NavbarDesktop {...props} />;
};

export default Navbar;
