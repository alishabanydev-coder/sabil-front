"use client";

import type { ReactNode } from "react";
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";
import type { PaletteOptions } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
// import { faIR } from "@mui/material/locale";
// import { faIR as DataTableFa } from "@mui/x-data-grid/locales";
// import { faIR as DateFaIR } from "@mui/x-date-pickers/locales";

const fontStack = [
  "system-ui",
  '"Bhel Puri"',
  '"Namecat"',
  '"Arco"',
  "sans-serif",
].join(", ");

const palette: PaletteOptions = {
  mode: "light",
  primary: {
    main: "#5c0c97",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#ff4c63",
    contrastText: "#ffffff",
  },
  success: {
    main: "#9ecb45",
    contrastText: "#121212",
  },
  warning: {
    main: "#dfff00",
    contrastText: "#121212",
  },
  background: {
    default: "#fafafa",
    paper: "#ffffff",
  },
  text: {
    primary: "#121212",
    secondary: "rgba(18, 18, 18, 0.72)",
  },
  divider: "rgba(18, 18, 18, 0.12)",
};

const appTheme = createTheme(
  {
    direction: "ltr",
    typography: {
      fontFamily: fontStack,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: fontStack,
          },
          "@keyframes modalParticleDrift": {
            "0%": {
              backgroundPosition:
                "0 0, 17px 43px, -31px 12px, 8px -27px, -19px 38px, 41px -9px, -14px 22px",
            },
            "100%": {
              backgroundPosition:
                "0 0, 89px -53px, -67px 74px, 43px 91px, -103px -37px, 58px -81px, -76px 47px",
            },
          },
          "@keyframes modalParticleDriftAlt": {
            "0%": {
              backgroundPosition: "-23px 31px, 14px -18px, -8px 44px, 27px -35px",
            },
            "100%": {
              backgroundPosition: "-97px 62px, 83px -71px, -54px -88px, 71px 49px",
            },
          },
        },
      },
      MuiModal: {
        styleOverrides: {
          root: {
            "&:not(.MuiPopover-root):not(.MuiMenu-root) .MuiBackdrop-root": {
              backgroundColor: "rgba(8, 12, 24, 0.5)",
              backdropFilter: "blur(4px)",
              backgroundImage:
                "linear-gradient(rgba(8, 12, 24, 0.3), rgba(8, 12, 24, 0.3)), radial-gradient(circle at 18% 24%, rgba(255,255,255,0.22) 0.6px, transparent 1.8px), radial-gradient(circle at 72% 61%, rgba(210,190,255,0.18) 0.5px, transparent 1.5px), radial-gradient(circle at 44% 83%, rgba(255,255,255,0.14) 0.7px, transparent 2px), radial-gradient(circle at 91% 17%, rgba(180,220,255,0.12) 0.4px, transparent 1.2px), radial-gradient(circle at 33% 52%, rgba(255,255,255,0.17) 0.55px, transparent 1.6px), radial-gradient(circle at 67% 38%, rgba(255,255,255,0.10) 0.45px, transparent 1.4px)",
              backgroundSize:
                "100% 100%, 67px 73px, 89px 79px, 103px 97px, 127px 113px, 139px 131px, 151px 149px",
              animation: "modalParticleDrift 28s linear infinite",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage:
                  "radial-gradient(circle at 26% 71%, rgba(255,255,255,0.13) 0.5px, transparent 1.5px), radial-gradient(circle at 58% 14%, rgba(220,200,255,0.15) 0.65px, transparent 1.9px), radial-gradient(circle at 84% 46%, rgba(255,255,255,0.11) 0.4px, transparent 1.3px), radial-gradient(circle at 11% 58%, rgba(190,210,255,0.14) 0.55px, transparent 1.7px)",
                backgroundSize: "83px 77px, 107px 101px, 131px 119px, 157px 143px",
                animation: "modalParticleDriftAlt 37s linear infinite reverse",
              },
            },
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          root: {
            "& .MuiBackdrop-root": {
              backgroundColor: "transparent",
              backdropFilter: "none",
              backgroundImage: "none",
              animation: "none",
              "&::before": {
                content: "none",
              },
            },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          root: {
            "& .MuiBackdrop-root": {
              backgroundColor: "transparent",
              backdropFilter: "none",
              backgroundImage: "none",
              animation: "none",
              "&::before": {
                content: "none",
              },
            },
          },
        },
      },
    },
    palette,
  },
  // faIR,
  // DateFaIR,
  // DataTableFa
);

type MUIThemeProviderProps = {
  children: ReactNode;
};

export default function MUIThemeProvider({ children }: MUIThemeProviderProps) {
  return (
    <AppRouterCacheProvider options={{ key: "css" }}>
      <MuiThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
