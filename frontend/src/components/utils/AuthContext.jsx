import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../api/authService";
import apiService from "../api/apiService";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await authService.isAuthenticated();
        setIsLoggedIn(auth.isAuthenticated);
        setUserName(auth.userName);
        setRole(auth.role);
      } catch (error) {
        console.error("AuthContext Error:", error);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (login, password, email = null) => {
    try {
      const data = await authService.login(login, password, email);
      setIsLoggedIn(true);
      // Add local cart items to logged in cart
      if (localStorage.getItem("cartItems")) {
        const cartItems = JSON.parse(localStorage.getItem("cartItems"));
        cartItems.forEach((item) => {
          apiService.addcart("add", item.product, item.quantity);
        });
        localStorage.removeItem("cartItems");
      }
      setUserName(data.login);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      clearCartOnLogout();
      setUserName("");
      setRole("");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, handleLogin, handleLogout, role, userName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
