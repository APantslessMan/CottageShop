import { useContext } from "react";
import { DataContext } from "./DataContext";

export const useThemeSettings = (mode) => {
  const { siteData } = useContext(DataContext);

  if (!siteData || !siteData.home_theme) {
    console.log("siteData", siteData);
    return null;
  }

  const darkTheme = siteData.home_theme.dark;
  const lightTheme = siteData.home_theme.light;

  return {
    palette: {
      ...(mode === "dark"
        ? {
            primary: { main: darkTheme.primary },
            secondary: { main: darkTheme.secondary },
            navbar: { main: darkTheme.navbar },
            background: {
              default: darkTheme.background,
              paper: darkTheme.paper,
            },
            text: {
              primary: darkTheme.text,
              secondary: darkTheme.secondaryText,
              menuSelected: darkTheme.menuSelected,
              disabled: "grey",
            },
          }
        : {
            primary: { main: lightTheme.primary },
            secondary: { main: lightTheme.secondary },
            navbar: { main: lightTheme.navbar },
            background: {
              default: lightTheme.background,
              paper: lightTheme.paper,
            },
            text: {
              primary: lightTheme.text,
              secondary: lightTheme.secondaryText,
              menuSelected: lightTheme.menuSelected,
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
