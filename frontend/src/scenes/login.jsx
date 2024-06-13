import React from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import "../css/Register.css";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  React.useEffect(() => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;
    onLogin(username, password);
  };
  const registerClick = () => {
    navigate("/register");
  };

  return (
    <div>
      <Box className="register-container">
        <Box className="register-content">
          <Box
            className="register-image"
            style={{
              backgroundImage: "url(./build/assets/img/site/login.jpg)",
            }}
          />
          <Paper className="register-form" elevation={5}>
            <Typography component="h1" variant="h5" className="register-title">
              Login
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
                name="username"
                label="Username"
                id="username"
                autoComplete="username"
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className="register-button"
              >
                Login
              </Button>
              <Typography
                variant="h6"
                className="register-link"
                style={{ marginTop: 20 }}
              >
                Don't have an account?{" "}
                <Button onClick={registerClick}>Register here</Button>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </div>
  );
};

export default Login;
