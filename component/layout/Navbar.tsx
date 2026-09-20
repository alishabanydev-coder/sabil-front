"use client";

import { useEffect, useState } from "react";
import {
  alpha,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DonationButton } from "../ui/DonationButton";

const HOME_SCROLL_TARGET_KEY = "homeScrollTarget";
const NAVBAR_SCROLL_OFFSET = 80;

type NavItem =
  | { label: string; href: string }
  | { label: string; sectionId: string };

const DEFAULT_NAV_ITEMS: readonly NavItem[] = [
  { label: "App", href: "/app" },
  { label: "news", sectionId: "contact" },
  { label: "People Opinions", sectionId: "about" },
  { label: "Watch Us", sectionId: "programs" },
  { label: "BreakDown", sectionId: "projects" },
  { label: "SUBSCRIBTION", sectionId: "subscription" },
];

const NAV_ITEMS_BY_ROUTE: Record<string, readonly NavItem[]> = {
  "/donation": [
    { label: "Catalogue", href: "/" },
    { label: "App", href: "/app" },
    { label: "Main Donation Page", href: "/donation" },
  ],
};

const resolveNavItems = (pathname: string): readonly NavItem[] => {
  const matchedRoute = Object.keys(NAV_ITEMS_BY_ROUTE).find(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return matchedRoute ? NAV_ITEMS_BY_ROUTE[matchedRoute] : DEFAULT_NAV_ITEMS;
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (!element) {
    return;
  }

  const top =
    element.getBoundingClientRect().top + window.scrollY - NAVBAR_SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
};

export default function Navbar({
  navItems,
}: {
  navItems?: readonly NavItem[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchor);

  const resolvedNavItems = navItems ?? resolveNavItems(pathname);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sectionId = window.sessionStorage.getItem(HOME_SCROLL_TARGET_KEY);
    if (!sectionId) {
      return;
    }

    window.sessionStorage.removeItem(HOME_SCROLL_TARGET_KEY);
    const timeoutId = window.setTimeout(() => scrollToSection(sectionId), 100);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const handleSectionClick = (
    event: React.MouseEvent<HTMLElement>,
    sectionId: string,
    shouldCloseMenu = false
  ) => {
    event.preventDefault();

    if (pathname === "/") {
      scrollToSection(sectionId);
    } else {
      window.sessionStorage.setItem(HOME_SCROLL_TARGET_KEY, sectionId);
      router.push("/");
    }

    if (shouldCloseMenu) {
      closeMenu();
    }
  };

  const handleHrefClick = (href: string, shouldCloseMenu = false) => {
    if (href === "/app" && typeof window !== "undefined") {
      window.sessionStorage.setItem("appLoaderStartAt", String(Date.now()));
    }
    if (shouldCloseMenu) {
      closeMenu();
    }
  };

  return (
    <Box
      component="header"
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 10,
        width: { xs: "85%", sm: "80%" },
        height: { xs: "40px", sm: "auto" },
        maxWidth: 1283,
        aspectRatio: "1283 / 107",
        boxSizing: "border-box",
        backgroundImage: "url(/navbar-background.png)",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: { xs: "space-between", sm: "flex-start" },
        gap: { xs: 1, sm: 3, md: 5, lg: 10, xl: 12 },
        px: { xs: 3, sm: 2, md: 3, lg: 4, xl: 5 },
        pl: { xs: 4, sm: 2 },
      }}
    >
      <DonationButton
        href="/donation"
        component={Link}
        sx={{
          px: { xs: 1.3, sm: 1.5, md: 1.5, lg: 2.2, xl: 2.5 },
          py: { xs: 0.8, sm: 1, md: 1.2, lg: 1.2, xl: 1.4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 0.5, sm: 0.3, md: 1 },

          "& img": {
            width: { xs: 10, sm: 12, md: 15, lg: 20 },
            height: { xs: 12, sm: 12, md: 17, lg: 21 },
          },
        }}
      >
        <img src="/heart.png" alt="heart" />

        <Typography
          sx={{
            fontSize: { xs: 10, md: 12, lg: 16, xl: 20 },
            fontFamily: "Namecat",
            letterSpacing: 2,
            lineHeight: 1,
            color: "#000",
          }}
        >
          Donate
        </Typography>
      </DonationButton>

      <Stack
        direction="row"
        sx={{
          gap: { xs: 2, md: 3, lg: 3, xl: 5 },
          alignItems: "center",
          display: { xs: "none", sm: "flex" },
        }}
      >
        {resolvedNavItems.map((item) =>
          "href" in item ? (
            <Typography
              key={item.label}
              component={Link}
              href={item.href}
              prefetch={false}
              onClick={() => handleHrefClick(item.href)}
              sx={{
                color: "#000",
                fontSize: { xs: 10, sm: 10, md: 12, lg: 18, xl: 20 },
                fontWeight: 700,
                fontFamily: "Namecat",
                letterSpacing: 2,
                textDecoration: "none",
                "&:hover": {
                  color: "primary.light",
                },
              }}
            >
              {item.label}
            </Typography>
          ) : (
            <Typography
              key={item.label}
              component="button"
              type="button"
              onClick={(event) => handleSectionClick(event, item.sectionId)}
              sx={{
                color: "#000",
                fontSize: { xs: 10, sm: 10, md: 12, lg: 18, xl: 20 },
                fontFamily: "Namecat",
                letterSpacing: 2,
                textDecoration: "none",
                background: "none",
                fontWeight: 700,
                border: "none",
                padding: 0,
                cursor: "pointer",
                "&:hover": {
                  color: "primary.light",
                },
              }}
            >
              {item.label}
            </Typography>
          )
        )}
      </Stack>
      {/* Menu Items for mobile    */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          justifyContent: { xs: "end", md: "center" },
        }}
      >
        <Button
          onClick={openMenu}
          size="small"
          color="primary"
          sx={{
            zIndex: 99999,
            minWidth: 0,
            py: 0.5,
            px: 1,
            borderRadius: 2,
            bgcolor: "rgba(255, 255, 255, 0.28)",
            backdropFilter: "blur(2px)",
            border: (theme) => `1px solid ${theme.palette.primary.main}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            "&:hover": {
              border: (theme) => `1px solid ${theme.palette.primary.light}`,
            },
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: 10,
              fontFamily: "Namecat",
              letterSpacing: 2,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            Menu
          </Typography>
          <MenuRoundedIcon sx={{ fontSize: 14 }} />
        </Button>
        <Menu
          id="navbar-mobile-menu"
          anchorEl={menuAnchor}
          open={isMenuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{
            "& .MuiList-root-MuiMenu-list": {
              px: 1,
              py: 0.5,
            },
          }}
        >
          {resolvedNavItems.map((item) =>
            "href" in item ? (
              <MenuItem
                key={item.label}
                component={Link}
                href={item.href}
                prefetch={false}
                onClick={() => handleHrefClick(item.href, true)}
                sx={{
                  mt: 0.4,
                  mx: 1,
                  py: 0.3,
                  fontSize: 12,
                  minHeight: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 0.3,
                  fontFamily: "Namecat",
                  letterSpacing: 2,
                  borderRadius: 1,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.light, 0.1),
                  color: "text.primary",
                  fontWeight: 400,
                }}
              >
                {item.label}
              </MenuItem>
            ) : (
              <MenuItem
                key={item.label}
                onClick={(event) =>
                  handleSectionClick(event, item.sectionId, true)
                }
                sx={{
                  mt: 0.4,
                  mx: 1,
                  py: 0.3,
                  fontSize: 12,
                  minHeight: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 0.3,
                  fontFamily: "Namecat",
                  letterSpacing: 2,
                  borderRadius: 1,
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.light, 0.1),
                  color: "text.primary",
                  fontWeight: 400,
                }}
              >
                {item.label}
              </MenuItem>
            )
          )}
        </Menu>
      </Box>
    </Box>
  );
}
