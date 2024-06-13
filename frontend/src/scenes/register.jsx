import React, { useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  useTheme,
  Grid,
} from "@mui/material";
import "../css/Register.css";
import authService from "../components/api/authService";

const Register = ({ onLogin, showSb }) => {
  const theme = useTheme();

  useEffect(() => {
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
    const form = e.target;
    const email = form.email.value;
    const f_name = form.f_name.value;
    const l_name = form.l_name.value;
    const username = form.username.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    if (password !== confirmPassword) {
      //TODO: Fix ShowSb, currently always says success
      showSb("Password Mismatch", "Error");
      return;
    }

    await authService.register(username, email, password, f_name, l_name);
    onLogin(email, password);
    showSb(`Registration Successful`, "success");
  };

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
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="f_name"
                    label="First Name"
                    id="f_name"
                    className="input-field"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="l_name"
                    label="Last Name"
                    id="l_name"
                    className="input-field"
                  />
                </Grid>
              </Grid>
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
    </div>
  );
};

export default Register;
