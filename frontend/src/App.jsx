import React, { useState, useEffect } from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Snackbar, Alert } from "@mui/material";
import Navbar from "./scenes/global/navbar";
import Login from "./scenes/login";
import Checkout from "./scenes/checkout/Checkout";
import OrderDetails from "./scenes/checkout/OrderDetails";
import Register from "./scenes/register";
import Wrapper from "./components/utils/wrapper";
import Home from "./scenes/home/home";
import SecureRoutes from "./components/utils/secureroutes";
import Dashboard from "./scenes/dashboard/index";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./components/utils/AuthContext"; // Import useAuth hook
import apiService from "./components/api/apiService";
import { useCart } from "./components/utils/CartWrapper";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  const [theme, colorMode, mode] = useMode();
  const auth = useAuth();
  const cart = useCart();
  const { setCartItems } = cart;
  const { isLoggedIn, handleLogin, handleLogout, role, userName } = auth;
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [sbError, setSbError] = useState("");
  const [sbType, setSbType] = useState("");
  // const location = useLocation();

  const handleOpenSnackbar = (error, type) => {
    setSbError(error);
    setSbType(type);
    setShowSnackbar(true);
  };

  // const useResetZoomAndScroll = () => {
  //   const location = useLocation();

  // useEffect(() => {
  //   const resetZoomAndScroll = () => {
  //     document.body.style.zoom = "1";
  //     window.scrollTo(0, 0);
  //   };

  //   resetZoomAndScroll();
  // }, [location]);

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
      } else {
        const savedCart = localStorage.getItem("cartItems");
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <main className="content">
            <Navbar />
            <Routes>
              <Route element={<SecureRoutes />}>
                <Route
                  path="/admin/*"
                  element={<Dashboard showSb={handleOpenSnackbar} />}
                />
              </Route>
              <Route
                path="/login"
                element={
                  <Login onLogin={handleLogin} showSb={handleOpenSnackbar} />
                }
              />
              <Route
                path="/register"
                element={
                  <Register onLogin={handleLogin} showSb={handleOpenSnackbar} />
                }
              />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-details" element={<OrderDetails />} />
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
        </LocalizationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
