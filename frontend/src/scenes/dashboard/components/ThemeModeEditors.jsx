import React, { useState } from "react";
import { Paper, Typography, Divider, Box, Grid } from "@mui/material";
import { SketchPicker } from "react-color";
import ColorPicker from "../utils/ColorPicker";

export const ThemeModeEditor = (mode) => {
  const [colors, setColors] = useState({
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
      main: "#3e4a42",
    },
    paper: {
      main: "#717d75",
    },
    text: {
      main: "#FFFFF0",
    },
    secondaryText: {
      main: "#FFFFF0",
    },
    menuSelected: {
      main: "#B2AC88",
    },
  });

  // TODO: Get theme from DB, specified by mode prop

  const handleColorChange = (id, color) => {
    setColors((prevColors) => ({
      ...prevColors,
      [id]: {
        ...prevColors[id],
        main: color,
      },
    }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} textAlign="center">
        {/* Demo Theme Here */}
        <Box
          bgcolor={colors.background.main}
          m={4}
          p={3}
          boxShadow={3}
          sx={{ borderRadius: 2 }}
        >
          <Typography
            style={{
              color: colors.text.main,
            }}
          >
            Title
          </Typography>

          <Paper
            style={{
              padding: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100px",
              background: colors.paper.main,
            }}
            elevation={7}
          >
            <Box display="flex">
              <Typography p={2} variant="h4">
                Text
              </Typography>
              <Typography p={2} variant="h4" color={colors.primary.main}>
                Selected Text
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider
          sx={{
            height: "2px",
            backgroundColor: "primary.main",
            margin: "-20px, 0",
          }}
          pl={3}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        {/* Them Editor pieces */}
        {/* <Box display="flex" ml={6}>
          <Typography variant="h4">Selected Text</Typography>
          <Box ml={2} width={24} height={24} backgroundColor={selectedColor}>
            <ColorPicker
              defaultColor={selectedColor}
              onColorChange={handleColorChange}
            />
          </Box>
        </Box> */}

        {Object.keys(colors).map((key) => (
          <ColorPicker
            id={key}
            defaultColor={colors[key].main}
            onColorChange={handleColorChange}
          />
        ))}
      </Grid>
    </Grid>
  );
};

export default ThemeModeEditor;
