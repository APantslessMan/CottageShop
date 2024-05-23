import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// // Create a theme context
// export const tokens = (mode) => ({
//   ...(mode === "dark"
//     ? {
//         grey: {
//           100: "#e0e0e0",
//           200: "#c2c2c2",
//           300: "#a3a3a3",
//           400: "#858585",
//           500: "#666666",
//           600: "#525252",
//           700: "#3d3d3d",
//           800: "#292929",
//           900: "#141414",
//         },
//         primary: {
//           100: "#d0d1d5",
//           200: "#a1a4ab",
//           300: "#727681",
//           400: "#434957",
//           500: "#141b2d",
//           600: "#101624",
//           700: "#0c101b",
//           800: "#080b12",
//           900: "#040509",
//         },
//         greenAccent: {
//           100: "#dbf5ee",
//           200: "#b7ebde",
//           300: "#94e2cd",
//           400: "#70d8bd",
//           500: "#4cceac",
//           600: "#3da58a",
//           700: "#2e7c67",
//           800: "#1e5245",
//           900: "#0f2922",
//         },
//         redAccent: {
//           100: "#f8dcdb",
//           200: "#f1b9b7",
//           300: "#e99592",
//           400: "#e2726e",
//           500: "#db4f4a",
//           600: "#af3f3b",
//           700: "#832f2c",
//           800: "#58201e",
//           900: "#2c100f",
//         },
//         blueAccent: {
//           100: "#e1e2fe",
//           200: "#c3c6fd",
//           300: "#a4a9fc",
//           400: "#868dfb",
//           500: "#6870fa",
//           600: "#535ac8",
//           700: "#3e4396",
//           800: "#2a2d64",
//           900: "#151632",
//         },
//       }
//     : {
//         grey: {
//           100: "#141414",
//           200: "#292929",
//           300: "#3d3d3d",
//           400: "#525252",
//           500: "#666666",
//           600: "#858585",
//           700: "#a3a3a3",
//           800: "#c2c2c2",
//           900: "#e0e0e0",
//         },
//         primary: {
//           100: "#040509",
//           200: "#080b12",
//           300: "#0c101b",
//           400: "#F2F0F0",
//           500: "#141b2d",
//           600: "#434957",
//           700: "#727681",
//           800: "#a1a4ab",
//           900: "#d0d1d5",
//         },
//         greenAccent: {
//           100: "#0f2922",
//           200: "#1e5245",
//           300: "#2e7c67",
//           400: "#3da58a",
//           500: "#4cceac",
//           600: "#70d8bd",
//           700: "#94e2cd",
//           800: "#b7ebde",
//           900: "#dbf5ee",
//         },
//         redAccent: {
//           100: "#2c100f",
//           200: "#58201e",
//           300: "#832f2c",
//           400: "#af3f3b",
//           500: "#db4f4a",
//           600: "#e2726e",
//           700: "#e99592",
//           800: "#f1b9b7",
//           900: "#f8dcdb",
//         },
//         blueAccent: {
//           100: "#151632",
//           200: "#2a2d64",
//           300: "#3e4396",
//           400: "#535ac8",
//           500: "#6870fa",
//           600: "#868dfb",
//           700: "#a4a9fc",
//           800: "#c3c6fd",
//           900: "#e1e2fe",
//         },
//       }),
// });

// gunMetal: {
//     100: "#d5d6d9",
//     200: "#abadb3",
//     300: "#81838e",
//     400: "#575a68",
//     500: "#2d3142",
//     600: "#242735",
//     700: "#1b1d28",
//     800: "#12141a",
//     900: "#090a0d"
// },
// payneGrey: {
//     100: "#dcdfe3",
//     200: "#b9bec8",
//     300: "#959eac",
//     400: "#727d91",
//     500: "#4f5d75",
//     600: "#3f4a5e",
//     700: "#2f3846",
//     800: "#20252f",
//     900: "#101317"
// },
// silver: {
//     100: "#f2f2f2",
//     200: "#e5e6e6",
//     300: "#d9d9d9",
//     400: "#cccdcd",
//     500: "#bfc0c0",
//     600: "#999a9a",
//     700: "#737373",
//     800: "#4c4d4d",
//     900: "#262626"
// },
// white: {
//     100: "#fcfcfc",
//     200: "#f9f9f9",
//     300: "#f6f6f6",
//     400: "#f3f3f3",
//     500: "#f0f0f0",
//     600: "#c0c0c0",
//     700: "#909090",
//     800: "#606060",
//     900: "#303030"
// },
// coralAccent: {
//     100: "#fce6dd",
//     200: "#f9cdbb",
//     300: "#f5b598",
//     400: "#f29c76",
//     500: "#ef8354",
//     600: "#bf6943",
//     700: "#8f4f32",
//     800: "#603422",
//     900: "#301a11"
// },

// Mui Theme settings
export const themeSettings = (mode) => {
  //   const colors = tokens(mode);

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

// Context for Color mode
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

  console.log("Theme:", theme); // Log the theme object

  return [theme, colorMode, mode];
  //   const tokensObject = tokens(mode);
  //   console.log("Tokens:", tokensObject); // Log the tokens object

  //   const theme = useMemo(() => createTheme(themeSettings(tokensObject)), [mode]);

  //   console.log("Theme:", theme); // Log the theme object

  //   return [theme, colorMode, mode];
};
