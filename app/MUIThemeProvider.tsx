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
              backgroundPosition: "0 0, 0 0, 0 0",
            },
            "100%": {
              backgroundPosition: "180px -180px, -220px 220px, 260px -260px",
            },
          },
        },
      },
      MuiModal: {
        styleOverrides: {
          root: {
            "& .MuiBackdrop-root": {
              backgroundColor: "rgba(8, 12, 24, 0.76)",
              backdropFilter: "blur(4px)",
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 2px), radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 2px), radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 2px)",
              backgroundSize: "160px 160px, 220px 220px, 280px 280px",
              animation: "modalParticleDrift 20s linear infinite",
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
