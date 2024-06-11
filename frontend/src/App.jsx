import React, { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Snackbar, Alert } from "@mui/material";
import Navbar from "./scenes/global/navbar";
import Login from "./scenes/login";
import Checkout from "./scenes/checkout/Checkout";
import Register from "./scenes/register";
import Wrapper from "./components/utils/wrapper";
import Home from "./scenes/home/home";
import SecureRoutes from "./components/utils/secureroutes";
import Dashboard from "./scenes/dashboard/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./components/utils/AuthContext"; // Import useAuth hook
import apiService from "./components/api/apiService";
import { useCart } from "./components/utils/CartWrapper";

function App() {
  const [theme, colorMode, mode] = useMode();
  const auth = useAuth();
  const cart = useCart();
  // const { setCartItems } = cart;
  const { isLoggedIn, handleLogin, handleLogout, role, userName } = auth;
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [sbError, setSbError] = useState("");
  const [sbType, setSbType] = useState("");

  const handleOpenSnackbar = (error, type) => {
    setSbError(error);
    setSbType(type);
    setShowSnackbar(true);
  };

  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn) {
        try {
          const cartItems = await apiService.getcart();
          console.log("cartItems", cartItems);
          cart.loadCart(cartItems);
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      }
      if (!isLoggedIn) {
        cart.clearCart();
      }
    };
    loadCart();
  }, [isLoggedIn]);

  const handleshowSnackBar = () => {
    setShowSnackbar(false);
  };

  return (
    <ColorModeContext.Provider value={{ ...colorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main className="content">
          <Navbar
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            userName={userName}
          />
          <Routes>
            <Route element={<SecureRoutes />}>
              <Route
                path="/admin/*"
                element={<Dashboard showSb={handleOpenSnackbar} />}
              />
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
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/" element={<Home />} />
          </Routes>

          <Snackbar
            open={showSnackbar}
            severity="error"
            autoHideDuration={6000}
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
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
