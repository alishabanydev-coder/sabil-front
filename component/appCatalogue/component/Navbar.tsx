"use client";

import { useMediaQuery, useTheme } from "@mui/material";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import NavbarCapacitor from "./NavbarCapacitor";
import type { NavbarProps } from "./navbarTypes";
import { useNativeApp } from "@/lib/capacitor/nativeApp";

const Navbar = (props: NavbarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isNative = useNativeApp();

  if (isNative) {
    return <NavbarCapacitor {...props} />;
  }

  if (isMobile) {
    return <NavbarMobile {...props} />;
  }

  return <NavbarDesktop {...props} />;
};

export default Navbar;
