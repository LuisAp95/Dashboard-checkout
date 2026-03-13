// src/context/TypographyContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type FontType = 'ibmPlex' | 'inter' | 'arial' | 'sans';

const TypographyContext = createContext<{
  font: FontType;
  setFont: (font: FontType) => void;
}>({ font: 'inter', setFont: () => {} });

export const useTypography = () => useContext(TypographyContext);

export const TypographyProvider = ({ children }: { children: ReactNode }) => {
  const [font, setFont] = useState<FontType>('inter');

  const getFontFamily = (selectedFont: FontType) => {
    switch (selectedFont) {
      case 'ibmPlex':
        return '"IBM Plex Sans", system-ui, sans-serif';
      case 'inter':
        return '"Inter", system-ui, sans-serif';
      case 'arial':
        return 'Arial, system-ui, sans-serif';
      default:
        return 'system-ui, sans-serif';
    }
  };

  return (
    <TypographyContext.Provider value={{ font, setFont }}>
      <div style={{ 
        fontFamily: getFontFamily(font),
        transition: 'font-family 0.3s ease'
      }}>
        {children}
      </div>
    </TypographyContext.Provider>
  );
};
