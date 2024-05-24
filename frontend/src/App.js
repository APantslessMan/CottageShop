import React, { useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./scenes/global/navbar";
import AuthModal from "./components/utils/authModal";
import Login from "./scenes/login";
import Cookies from "js-cookie";
import Wrapper from "./utils/wrapper";
import Home from "./scenes/home";
import SecureRoutes from "./components/utils/secureroutes";
import Dashboard from "./scenes/dashboard/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import authService from "./components/api/authService";

function App() {
  const [theme, colorMode, mode] = useMode();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const apiUrl = process.env.REACT_APP_API_URL;
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const handleOpenAuthModal = () => {
    setOpenAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setOpenAuthModal(false);
  };

  const handleLogin = async (login, password, email = null) => {
    try {
      const data = await authService.login(login, password, email);
      setIsLoggedIn(true);
      setUserName(data.login);
      setRole(data.role);
      handleCloseAuthModal();
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleLogout = () => {
    // Handle logout logic here

    Cookies.remove("access_token_cookie");
    setIsLoggedIn(false);
  };

  return (
    <ColorModeContext.Provider value={{ ...colorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <Navbar
              onOpenAuthModal={handleOpenAuthModal}
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
            />
            <Routes>
              <Route element={<SecureRoutes />}>
                <Route path="/admin/*" element={<Dashboard />} />
              </Route>
              <Route
                path="/login"
                element={<Wrapper component={Login} onLogin={handleLogin} />}
              />
              <Route path="/" element={<Home />} />
            </Routes>

            <AuthModal
              open={openAuthModal}
              handleClose={handleCloseAuthModal}
              onLogin={handleLogin}
            />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
