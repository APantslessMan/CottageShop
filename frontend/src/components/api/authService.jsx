import axios from "axios";
import Cookies from "js-cookie";
let apiUrl = ""; // For production
// let apiUrl = "http://localhost:5000"; // For local development
// const apiUrl = process.env.REACT_APP_API_URL;
// const apiUrl = "https://cottage-shop.vercel.app"; // For vercel deployment
const authService = {
  login: async (login, password) => {
    try {
      const response = await axios.post(
        `${apiUrl}/login`,
        { login, password },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        Cookies.set("access_token_cookie", response.data.access_token, {
          secure: true,
          sameSite: "Strict",
        });
        Cookies.set("refresh_token_cookie", response.data.refresh_token, {
          secure: true,
          sameSite: "Strict",
        });
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/refresh`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        return { isAuthenticated: true, userName: response.data.username };
      } else {
        return { isAuthenticated: false, userName: "" };
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await axios.post(
        `${apiUrl}/register`,
        { username, email, password },
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log("Registration successful:", response.data);
        return response.data; // Return success message
      } else {
        console.error("Registration failed:", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return error; // Return error object
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
        return { isAuthenticated: true, userName: response.data.username };
      } else {
        return { isAuthenticated: false, userName: "" };
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      return { isAuthenticated: false, userName: "" };
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        Cookies.remove("access_token_cookie");
        Cookies.remove("refresh_token_cookie");
        return true;
      }
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },

  editUser: async (op, userid) => {
    authService.refreshToken();
    try {
      const response = await axios.post(
        `${apiUrl}/useredit`,
        { op, userid },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error("Error during Useredit:", error);
      throw error;
    }
  },
};
export default authService;
