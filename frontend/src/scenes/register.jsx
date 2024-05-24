import React, { useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import "./Register.css";

const Register = () => {
  const theme = useTheme();

  useEffect(() => {
    // Dynamically set the CSS variables for background and text colors
    document.documentElement.style.setProperty(
      "--background-paper",
      theme.palette.background.paper
    );
    document.documentElement.style.setProperty(
      "--background-default",
      theme.palette.background.main
    );
    document.documentElement.style.setProperty(
      "--text-primary",
      theme.palette.text.primary
    );
  }, [
    theme.palette.background.paper,
    theme.palette.text.primary,
    theme.palette.background.main,
  ]);

  return (
    <Box className="register-container">
      <Box className="register-content">
        <Box
          className="register-image"
          style={{
            backgroundImage: "url(https://source.unsplash.com/random)", // Replace with your image URL
          }}
        />
        <Paper className="register-form" elevation={5}>
          <Typography component="h1" variant="h5" className="register-title">
            Register
          </Typography>
          <Box component="form" noValidate className="register-form-container">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="username"
              label="Username"
              id="username"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="register-button"
            >
              Register
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;
