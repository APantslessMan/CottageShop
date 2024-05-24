import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const themeSettings = (mode) => {
  return {
    palette: {
      ...(mode === "dark"
        ? {
            primary: {
              main: "#727998",
            },
            secondary: {
              main: "#7A3B69",
            },
            background: {
              default: "#2d3142",
              paper: "#1b1d28",
            },
            text: {
              primary: "#ffffff",
              secondary: "#cccccc",
              menuSelected: "#888",
            },
          }
        : {
            primary: {
              main: "#563440",
            },
            secondary: {
              main: "#7A3B69",
            },
            background: {
              default: "#fcfcfc",
              paper: "#CFCFCD",
            },
            text: {
              primary: "#000000",
              secondary: "#333333",
              menuSelected: "#888",
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode, mode];
};
