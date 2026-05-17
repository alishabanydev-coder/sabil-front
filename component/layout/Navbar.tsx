"use client";

import { useEffect, useState } from "react";
import {
  alpha,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScondaryButton } from "../ui/ScondaryButton";

const navItems = [
  { label: "Contact", href: "/#contact" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/#programs" },
  { label: "Project", href: "/#projects" },
  { label: "Home", href: "/" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeHref, setActiveHref] = useState("/");
  const isMenuOpen = Boolean(menuAnchor);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveHref(pathname);
      return;
    }

    const hashHref = window.location.hash ? `/${window.location.hash}` : "/";
    setActiveHref(hashHref);

    const sectionHrefs = navItems
      .map((item) => item.href)
      .filter((href) => href.startsWith("/#"));
    const sections = sectionHrefs
      .map((href) => ({
        href,
        element: document.getElementById(href.slice(2)),
      }))
      .filter((entry) => entry.element);

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          const activeId = visibleEntries[0].target.id;
          setActiveHref(`/#${activeId}`);
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section.element));

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  const isActiveLink = (href: string) => {
    return activeHref === href;
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const handleNavClick = (href: string, shouldCloseMenu = false) => {
    setActiveHref(href);
    if (shouldCloseMenu) {
      closeMenu();
    }
  };

  return (
    <Box
      component="header"
      sx={{
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        gap: { xs: 1, sm: 2 },
        justifyContent: { xs: "space-between", sm: "start" },
        alignItems: { xs: "center", md: "center" },
        top: { xs: 10, md: 15 },
        left: 0,
        zIndex: 10,
        width: "100%",
        px: { xs: 1, md: 8 },
      }}
    >
      <ScondaryButton
        sx={{
          px: { xs: 0.7, sm: 2 },
          py: { xs: 0.4, sm: 1 },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 11, md: 16, lg: 18 },
            fontFamily: "Namecat",
            letterSpacing: 2,
          }}
        >
          SIGN IN
        </Typography>
      </ScondaryButton>

      <Stack
        direction="row"
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          py: 1.5,
          borderRadius: 999,
          position: "relative",
          overflow: "hidden",
          bgcolor: "rgba(255, 255, 255, 0.28)",
          boxShadow:
            "0 3px 0 rgba(248, 240, 240, 0.0) inset, 0 -6px 0 rgba(136, 18, 84, 0.2) inset, 0 16px 28px rgba(92, 12, 151, 0.3)",
          backdropFilter: "blur(10px)",
          transform: "translateY(-1px)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-40%",
            left: "-65%",
            width: "45%",
            height: "180%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.12) 25%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.12) 75%, transparent 100%)",
            transform: "skewX(-22deg)",
            transition: "left 0.75s ease",
            pointerEvents: "none",
          },
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "0 3px 0 rgba(248, 240, 240, 0.18) inset, 0 -6px 0 rgba(136, 18, 84, 0.24) inset, 0 20px 34px rgba(92, 12, 151, 0.36)",
          },
          "&:hover::before": {
            left: "120%",
          },
        }}
      >
        <Stack direction="row" sx={{ gap: { xs: 1, md: 4 } }}>
          {navItems.map((item) => (
            <Typography
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              sx={{
                color: isActiveLink(item.href) ? "primary.main" : "#fff",
                fontSize: { xs: 12, md: 14, lg: 16 },
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
          ))}
        </Stack>
      </Stack>

      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          justifyContent: { xs: "end", md: "center" },
        }}
      >
        <IconButton
          aria-label="open navigation menu"
          aria-controls={isMenuOpen ? "navbar-mobile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isMenuOpen ? "true" : undefined}
          onClick={openMenu}
          size="small"
          color="primary"
          sx={{
            borderRadius: 2,
            bgcolor: "rgba(255, 255, 255, 0.28)",
            backdropFilter: "blur(2px)",
            border: (theme) => `1px solid ${theme.palette.primary.main}`,
            "&:hover": {
              border: (theme) => `1px solid ${theme.palette.primary.light}`,
            },
          }}
        >
          <MenuRoundedIcon sx={{ fontSize: { xs: 17, md: 17 } }} />
        </IconButton>
        <Menu
          id="navbar-mobile-menu"
          anchorEl={menuAnchor}
          open={isMenuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            "& .MuiList-root-MuiMenu-list": {
              px: 1,
              py: 0.5,
            },
          }}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.href}
              component={Link}
              href={item.href}
              onClick={() => handleNavClick(item.href, true)}
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
                  isActiveLink(item.href)
                    ? alpha(theme.palette.primary.light, 0.3)
                    : alpha(theme.palette.primary.light, 0.1),
                color: isActiveLink(item.href)
                  ? "primary.main"
                  : "text.primary",
                fontWeight: isActiveLink(item.href) ? 700 : 400,
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
}
