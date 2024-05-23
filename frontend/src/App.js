import React, { useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./scenes/global/navbar";
import AuthModal from "./components/utils/authModal";
import Cookies from "js-cookie";
import ProtectedRoute from "./components/utils/ProtectedRoutes";
import Dashboard from "./scenes/dashboard/index";
import { Route, Routes, BrowserRouter } from "react-router-dom";

function App() {
  const [theme, colorMode, mode] = useMode();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
  const [userName, setUserName] = useState("");

  const handleOpenAuthModal = () => {
    setOpenAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setOpenAuthModal(false);
  };

  const handleLogin = async (login, password, email = null) => {
    const mode = "login";
    try {
      const endpoint = mode === "login" ? "/login" : "/register";
      const body =
        mode === "login"
          ? JSON.stringify({ login, password })
          : JSON.stringify({ username: login, email, password });
      console.log(`${apiUrl}${endpoint}`);
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        setUserName(data.login);
        setRole(data.role);
        handleCloseAuthModal(false);
        console.log("Authentication successful:", data);

        if (data.access_token) {
          console.log("access_token_cookie", data.access_token);
          Cookies.set("access_token_cookie", data.access_token);
          console.log(Cookies.get("access_token_cookie"));
        }
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
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
              {/* <Route path="/" element={<Home />} /> */}
              {/* <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} /> */}
              {/* <ProtectedRoute path="/admin" component={Dashboard} /> */}
              <Route
                path="/admin"
                element={<ProtectedRoute adminComponent={Dashboard} />}
              />
              {/* <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} /> */}
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
