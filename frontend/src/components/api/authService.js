import axios from "axios";
import Cookies from "js-cookie";

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
      if (response.status === 200) {
        return true;
      } else {
        throw new Error("Not authenticated");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      throw error;
    }
  },
};

export default authService;
