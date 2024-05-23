import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import authService from "../api/authService"; // Import your authentication service

const SecureRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initial state set to null
  const [showSnackbar, setShowSnackbar] = useState(true);
  const [error, setError] = useState(null); // State to store authentication error

  useEffect(() => {
    const authCheck = async () => {
      try {
        const auth = await authService.isAuthenticated();
        setIsAuthenticated(auth);
        setShowSnackbar(false); // Hide the snackbar after authentication check
      } catch (error) {
        console.error("Error checking authentication:", error);
        setError(error); // Store authentication error
        setIsAuthenticated(false); // Handle error by setting isAuthenticated to false
        setShowSnackbar(false); // Hide the snackbar in case of error
      }
    };
    authCheck();
  }, []);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  if (showSnackbar) {
    // Show loading indicator while authentication check is in progress
    return (
      <Snackbar
        open={true}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert severity="info" onClose={handleCloseSnackbar}>
          Checking authentication...
        </MuiAlert>
      </Snackbar>
    );
  }

  if (error) {
    // Handle authentication error
    console.error("Authentication failed:", error.message);
    return <Navigate to="/login" />;
  }

  // Render routes based on authentication status
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default SecureRoutes;
