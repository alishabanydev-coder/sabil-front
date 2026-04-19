'use client';

import type { ReactNode } from 'react';
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material';
import type { PaletteOptions } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { faIR } from '@mui/material/locale';
import { faIR as DataTableFa } from '@mui/x-data-grid/locales';
import { faIR as DateFaIR } from '@mui/x-date-pickers/locales';

const fontStack = ['"Bhel Puri"', '"Namecat"', '"Arco"', 'system-ui', 'sans-serif'].join(
  ', '
);

const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#5c0c97',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ff4c63',
    contrastText: '#ffffff',
  },
  success: {
    main: '#9ecb45',
    contrastText: '#121212',
  },
  warning: {
    main: '#dfff00',
    contrastText: '#121212',
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
  },
  text: {
    primary: '#121212',
    secondary: 'rgba(18, 18, 18, 0.72)',
  },
  divider: 'rgba(18, 18, 18, 0.12)',
};

const appTheme = createTheme(
  {
    direction: 'rtl',
    typography: {
      fontFamily: fontStack,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: fontStack,
          },
        },
      },
    },
    palette,
  },
  faIR,
  DateFaIR,
  DataTableFa
);

type MUIThemeProviderProps = {
  children: ReactNode;
};

export default function MUIThemeProvider({ children }: MUIThemeProviderProps) {
  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <MuiThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
