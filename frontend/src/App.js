import React, { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Snackbar, Alert } from "@mui/material";
import Navbar from "./scenes/global/navbar";
import AuthModal from "./components/utils/authModal";
import Login from "./scenes/login";
import Register from "./scenes/register";
import Cookies from "js-cookie";
import Wrapper from "./utils/wrapper";
import Home from "./scenes/home";
import SecureRoutes from "./components/utils/secureroutes";
import Dashboard from "./scenes/dashboard/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import authService from "./components/api/authService";

function App() {
  const [theme, colorMode, mode] = useMode();
  // const [openAuthModal, setOpenAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const apiUrl = process.env.REACT_APP_API_URL;
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [sbError, setSbError] = useState("");
  const [sbType, setSbType] = useState("");
  // const handleOpenAuthModal = () => {
  //   setOpenAuthModal(true);
  // };

  // const handleCloseAuthModal = () => {
  //   setOpenAuthModal(false);
  // };
  const handleOpenSnackbar = (error, type) => {
    setSbError(error);
    setSbType(type);
    setShowSnackbar(true);
  };

  const handleshowSnackBar = () => {
    setShowSnackbar(false);
  };

  const handleLogin = async (login, password, email = null) => {
    try {
      const data = await authService.login(login, password, email);
      setIsLoggedIn(true);
      setUserName(data.login);
      setRole(data.role);
      // handleCloseAuthModal();
      navigate("/");
      handleOpenSnackbar("Logged In", "success");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setUserName(false);
      setRole(false);
      Cookies.remove("access_token_cookie");
      handleOpenSnackbar("Logged Out", "success");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await authService.isAuthenticated();
        setIsLoggedIn(auth.isAuthenticated);
        setUserName(auth.userName);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <ColorModeContext.Provider value={{ ...colorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            {console.log("username", userName)}
            <Navbar
              // onOpenAuthModal={handleOpenAuthModal}
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
              userName={userName}
            />
            <Routes>
              <Route element={<SecureRoutes />}>
                <Route path="/admin/*" element={<Dashboard />} />
              </Route>
              <Route
                path="/login"
                element={<Wrapper component={Login} onLogin={handleLogin} />}
              />
              <Route
                path="/register"
                element={
                  <Register onLogin={handleLogin} showSb={handleOpenSnackbar} />
                }
              />
              <Route path="/" element={<Home />} />
            </Routes>

            {/* <AuthModal
              open={openAuthModal}
              handleClose={handleCloseAuthModal}
              onLogin={handleLogin}
            /> */}
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
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
