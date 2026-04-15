'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { faIR } from '@mui/material/locale';
import { faIR as DataTableFa } from '@mui/x-data-grid/locales';
import { faIR as DateFaIR } from '@mui/x-date-pickers/locales';
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const baseTheme = {
  direction: 'rtl' as const,
};

export const getCustomTheme = () =>
  createTheme(
    {
      ...baseTheme,
      palette: {},
    },
    faIR,
    DateFaIR,
    DataTableFa
  );

export default function MUIThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useContext(ThemeContext);

  const theme = getCustomTheme();

  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
