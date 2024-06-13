import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useAuth } from "./AuthContext";

const SecureRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(true);
  const [error, setError] = useState(null);
  const { role, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      setIsAuthenticated(false);
    } else {
      if (role === "admin") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
    setShowSnackbar(false);
  }, []);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  if (showSnackbar) {
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

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default SecureRoutes;
