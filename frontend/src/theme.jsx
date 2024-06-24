import { createContext, useState, useMemo, useEffect, useContext } from "react";
import { createTheme } from "@mui/material/styles";
import { DataContext } from "./components/utils/DataContext";
import { useThemeSettings } from "./components/utils/useThemeSettings";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");
  const themeSettings = useThemeSettings(mode);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () => (themeSettings ? createTheme(themeSettings) : createTheme()),
    [themeSettings]
  );

  return [theme, colorMode, mode];
};
