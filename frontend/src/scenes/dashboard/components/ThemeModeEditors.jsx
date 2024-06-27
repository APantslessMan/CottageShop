import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Divider,
  Box,
  Grid,
  InputLabel,
  FormControl,
  Select,
  TextField,
  Avatar,
  Button,
} from "@mui/material";
import ApiDataFetch from "../../../components/api/ApiDataFetch";
import ColorPicker from "../utils/ColorPicker";

export const ThemeModeEditor = () => {
  const [themeData, setThemeData] = useState(null);
  const [colors, setColors] = useState({
    primary: "#B2AC88",
    secondary: "#FFFFF0",
    navbar: "#000000",
    background: "#3e4a42",
    divider: "#B2AC88",
    paper: "#717d75",
    text: "#FFFFF0",
    secondaryText: "#FFFFF0",
    menuSelected: "#B2AC88",
  });
  const [themeName, setThemeName] = useState("");
  const [availableThemes, setAvailableThemes] = useState([]);
  const [newThemeName, setNewThemeName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [helperText, setHelperText] = useState("");

  useEffect(() => {
    const fetchThemeData = async () => {
      try {
        const data = await ApiDataFetch.main({ type: "theme" });
        setThemeData(data);
        const themes = data.theme_dark.reduce((acc, theme) => {
          return acc.concat(Object.keys(theme));
        }, []);
        setAvailableThemes(themes);
      } catch (error) {
        console.error("Failed to fetch site data:", error);
      }
    };
    fetchThemeData();
  }, []);

  useEffect(() => {
    if (themeData && themeName) {
      const selectedTheme = themeData.theme_dark.find(
        (theme) => theme[themeName]
      )[themeName];
      const parsedColors = parseColors(selectedTheme);
      setColors(parsedColors);
    }
  }, [themeData, themeName]);

  const parseColors = (colorsObject) => {
    return { ...colorsObject };
  };

  const handleThemeSelect = (event) => {
    setThemeName(event.target.value);
  };

  const handleColorChange = (id, color) => {
    setColors((prevColors) => ({
      ...prevColors,
      [id]: color,
    }));
  };

  const saveTheme = () => {
    if (!newThemeName) {
      setNameError(true);
      setHelperText("Please enter a theme name.");
      return;
    }

    if (availableThemes.includes(newThemeName)) {
      setNameError(true);
      setHelperText("Theme name must be unique.");
      return;
    }

    setThemeData((prevData) => {
      const newTheme = { [newThemeName]: colors };
      return {
        ...prevData,
        theme_dark: [...prevData.theme_dark, newTheme],
      };
    });

    setAvailableThemes((prevThemes) => [...prevThemes, newThemeName]);
    setNewThemeName("");
    setNameError(false);
    setHelperText("");
    console.log(themeData);
    alert("Theme saved successfully."); //TODO: move to snackbar
  };

  const handleNewThemeNameChange = (event) => {
    setNewThemeName(event.target.value);
    setNameError(false);
    setHelperText("");
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} textAlign="center">
        <Box
          bgcolor={colors.background}
          m={4}
          p={3}
          boxShadow={3}
          sx={{ borderRadius: 2 }}
        >
          <Grid container alignItems="center" sx={{ width: "100%" }}>
            <Grid
              item
              xs={12}
              sx={{
                height: 40,
                mt: -3,
                bgcolor: colors.navbar,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Typography variant="h3" sx={{ paddingLeft: "14px" }}>
                TITLE TEXT
              </Typography>
              <Avatar
                sx={{
                  marginLeft: "auto",
                  bgcolor: colors.primary,
                  color: colors.text.secondary,
                }}
              />
            </Grid>
          </Grid>
          <Typography variant="h2" style={{ color: colors.text }}>
            Title
          </Typography>
          <Paper
            style={{
              padding: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100px",
              background: colors.paper,
            }}
            elevation={7}
          >
            <Box display="flex">
              <Typography
                p={2}
                variant="h4"
                style={{ color: colors.secondaryText }}
              >
                Secondary Text
              </Typography>
              <Typography p={2} variant="h4" color={colors.primary}>
                Selected Text
              </Typography>
            </Box>
          </Paper>
          <Box pt={4}>
            <Divider
              sx={{
                color: colors.divider,
                bgcolor: colors.divider,
                height: "2px",
              }}
              pl={3}
            >
              Divider
            </Divider>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Divider
          sx={{
            height: "2px",
            backgroundColor: colors.primary,
            margin: "-20px, 0",
          }}
          pl={3}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        {Object.keys(colors).map((key) => (
          <ColorPicker
            key={key}
            id={key}
            defaultColor={colors[key]}
            onColorChange={handleColorChange}
          />
        ))}
      </Grid>

      <Grid item xs={12} md={8}>
        <FormControl
          sx={{ width: { md: "480px", xs: "300px" }, padding: "8px" }}
        >
          <InputLabel shrink htmlFor="select-theme">
            Themes
          </InputLabel>
          <Select
            native
            value={themeName}
            onChange={handleThemeSelect}
            label="Themes"
            inputProps={{
              name: "theme",
              id: "select-theme",
            }}
          >
            <option value="">Select a theme</option>
            {availableThemes.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </Select>
          <TextField
            required
            id="outlined-required"
            label="New Theme Name"
            value={newThemeName}
            onChange={handleNewThemeNameChange}
            error={nameError}
            helperText={helperText}
            sx={{ flexGrow: 1, marginTop: 2 }}
          />
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
            pt={2}
          >
            <Button
              name="demo"
              variant="contained"
              color="primary"
              className="register-button"
              sx={{ marginRight: 2 }}
              onClick={saveTheme}
            >
              Save Theme
            </Button>
            <Button
              width={12}
              name="demo"
              variant="contained"
              color="primary"
              className="register-button"
            >
              Apply To Site
            </Button>
          </Box>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ThemeModeEditor;
