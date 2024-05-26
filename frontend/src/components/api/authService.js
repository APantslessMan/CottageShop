import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

const authService = {
  login: async (login, password, email = null) => {
    const mode = "login";
    try {
      const endpoint = mode === "login" ? "/login" : "/register";
      const body =
        mode === "login"
          ? { login, password }
          : { username: login, email, password };

      const response = await axios.post(`${apiUrl}${endpoint}`, body, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const data = response.data;
      if (response.status === 200) {
        if (data.access_token) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          Cookies.set(
            "access_token_cookie",
            data.access_token,
            { path: "/" },
            { expires: expiryDate }
          );
        }
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      throw error;
    }
  },
  register: async (username, email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/register`, {
        username,
        email,
        password,
      });
      // return { error: null };
    } catch (error) {
      console.error("Error during registration:", error);
      return { error: error.response.data.message };
    }
  },
  getRole: async () => {
    try {
      const response = await axios.get(`${apiUrl}/role`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        return response.data.role;
      } else {
        throw new Error("Failed to get role");
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      throw error;
    }
  },
  isAuthenticated: async () => {
    try {
      const response = await axios.get(`${apiUrl}/auth`, {
        withCredentials: true,
      });
      console.log("response", response.data.username);
      if (response.status === 200) {
        return { isAuthenticated: true, userName: response.data.username };
      } else {
        throw new Error("Not authenticated");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      throw error;
    }
  },
  logout: async () => {
    try {
      const response = await axios.post(`${apiUrl}/logout`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return { error: error.response.data.message };
    }
  },
};

export default authService;
