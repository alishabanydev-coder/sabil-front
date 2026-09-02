"use client";

import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";
import NavbarCapacitor from "./NavbarCapacitor";
import type { NavbarProps } from "./navbarTypes";
import type { AppDisplayMode } from "@/lib/useAppDisplayMode";

const Navbar = ({
  displayMode,
  ...props
}: NavbarProps & { displayMode: Exclude<AppDisplayMode, "pending"> }) => {
  if (displayMode === "native") {
    return <NavbarCapacitor {...props} />;
  }

  if (displayMode === "mobile") {
    return <NavbarMobile {...props} />;
  }

  return <NavbarDesktop {...props} />;
};

export default Navbar;
