'use client';

import React, { createContext, Dispatch, SetStateAction, useState } from 'react';

export type PaletteType = 'default';

interface ThemeContextType {
  palette: PaletteType;
  setPalette: Dispatch<SetStateAction<PaletteType>>;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [palette, setPalette] = useState<PaletteType>('default');

  return (
    <ThemeContext.Provider value={{ palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};
