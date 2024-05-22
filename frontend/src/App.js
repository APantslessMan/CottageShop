import React, { useState } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./scenes/global/navbar";
import AuthModal from "./components/utils/authModal";

function App() {
  const [theme, colorMode, mode] = useMode();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleOpenAuthModal = () => {
    setOpenAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setOpenAuthModal(false);
  };
  const handleLogin = () => {
    // Handle login logic here
    console.log("Logged in!");
    setIsLoggedIn(true);
    handleCloseAuthModal();
  };

  const handleLogout = () => {
    // Handle logout logic here
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
