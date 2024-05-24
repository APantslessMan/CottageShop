import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AuthModal = ({ open, handleClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    onLogin(form.email, form.password);

    // Handle form submission logic here
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setForm({ email: "", password: "", confirmPassword: "" });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {isLogin ? "Login" : "Register"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleFormSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={form.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleInputChange}
          />
          {!isLogin && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="confirm-password"
              value={form.confirmPassword}
              onChange={handleInputChange}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleAuthMode}>
          {isLogin ? "Switch to Register" : "Switch to Login"}
        </Button>
        <Button type="submit" onClick={handleFormSubmit}>
          {isLogin ? "Login" : "Register"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;
