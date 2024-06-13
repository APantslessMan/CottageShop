import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// indigo: {
//     100: "#dbdfdd",
//     200: "#b8beba",
//     300: "#949e98",
//     400: "#717d75",
//     500: "#4d5d53",
//     600: "#3e4a42",
//     700: "#2e3832",
//     800: "#1f2521",
//     900: "#0f1311"
// },

//#B2AC88 is sand color

// gray: {
//     100: "#f0eee7",
//     200: "#e0decf",
//     300: "#d1cdb8",
//     400: "#c1bda0",
//     500: "#b2ac88",
//     600: "#8e8a6d",
//     700: "#6b6752",
//     800: "#474536",
//     900: "#24221b"
// },

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
              main: "#FFFFF0",
            },
            navbar: {
              main: "#FFFFF0",
            },
            background: {
              default: "#3e4a42",
              paper: "#717d75",
            },
            text: {
              primary: "#FFFFF0",
              secondary: "#FFFFF0",
              menuSelected: "#D2B48C",
              disabled: "grey",
            },
          }
        : {
            // Light Mode colors
            primary: {
              main: "#B2AC88",
            },
            secondary: {
              main: "#FFFFF0",
            },
            navbar: {
              main: "#FFFFF0",
            },
            background: {
              default: "#F5F5DC",
              paper: "#FFFFF0",
            },
            text: {
              primary: "#333333",
              secondary: "#B8860B",
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
