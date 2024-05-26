import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import "./Register.css";
import authService from "../components/api/authService";

const Register = ({ onLogin }) => {
  const theme = useTheme();

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [sbError, setSbError] = useState("");
  const [sbType, setSbType] = useState("");

  const handleshowSnackBar = () => {
    setShowSnackbar(false);
  };

  useEffect(() => {
    // Dynamically set the CSS variables for background and text colors
    document.documentElement.style.setProperty(
      "--background-paper",
      theme.palette.background.paper
    );
    document.documentElement.style.setProperty(
      "--background-default",
      theme.palette.background.default
    );
    document.documentElement.style.setProperty(
      "--text-primary",
      theme.palette.text.primary
    );
  }, [
    theme.palette.background.paper,
    theme.palette.background.default,
    theme.palette.text.primary,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Get form values
    const form = e.target;
    const email = form.email.value;
    const username = form.username.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    if (password !== confirmPassword) {
      setSbError("Password Mismatch");
      setShowSnackbar(true);
      return;
    }

    const error = await authService.register(username, email, password);
    // console.log(`Error: ${error}`);
    if (error) {
      console.log(`Error: ${error.response}`);
      setSbError(`Registration Failed: ${error}`);
      setSbType("error");
      setShowSnackbar(true);
    } else {
      setSbError(`Registration Successful`);
      setSbType("success");
      setShowSnackbar(true);
      onLogin(email, password);
    }
  };
  // console.log({ email, username, password, confirmPassword });

  return (
    <div>
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
            <Box
              component="form"
              noValidate
              className="register-form-container"
              onSubmit={handleSubmit}
            >
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
                className="input-field"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="username"
                label="Username"
                id="username"
                className="input-field"
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
                className="input-field"
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
                className="input-field"
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
      <Snackbar
        open={showSnackbar}
        severity="error"
        autoHideDuration={6000} // Adjust as needed
        onClose={handleshowSnackBar}
        message={sbError}
      >
        <Alert
          onClose={handleshowSnackBar}
          severity={sbType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {sbError}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Register;
