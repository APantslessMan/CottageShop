import React from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Login = ({ onLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Get username and password from form fields
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    // Call the onLogin function passed as a prop
    onLogin(username, password);
  };

  return (
    <Paper
      elevation={3}
      style={{ width: 300, padding: 20, margin: "auto", marginTop: 100 }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          name="username"
          style={{ marginBottom: 20 }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          name="password"
          style={{ marginBottom: 20 }}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Login
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
