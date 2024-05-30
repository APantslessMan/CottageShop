import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const themeSettings = (mode) => {
  return {
    palette: {
      ...(mode === "dark"
        ? {
            // Dark mode colors
            primary: {
              main: "#B2AC88",
            },
            secondary: {
              main: "#2F4F4F",
            },
            navbar: {
              main: "#FFFFF0",
            },
            background: {
              default: "#36454F",
              paper: "#2F4F4F",
            },
            text: {
              primary: "#FFFFF0",
              secondary: "#D2B48C",
              menuSelected: "#D2B48C",
              disabled: "grey",
            },
          }
        : {
            // Light Mode colors
            primary: {
              main: "#2F4F4F",
            },
            secondary: {
              main: "#B2AC88",
            },
            navbar: {
              main: "#FFFFF0",
            },
            background: {
              default: "#FFFFF0",
              paper: "#708090",
            },
            text: {
              primary: "#333333",
              secondary: "#8B4513",
              menuSelected: "#8B4513",
              disabled: "grey",
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
