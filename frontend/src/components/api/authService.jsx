import axios from "axios";
import Cookies from "js-cookie";
import apiService from "./apiService";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "";

const authService = {
  login: async (login, password) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/login`,
        { login, password },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        Cookies.set("access_token_cookie", response.data.access_token, {
          secure: true,
          sameSite: "lax",
        });
        Cookies.set("refresh_token_cookie", response.data.refresh_token, {
          secure: true,
          sameSite: "lax",
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
      const sessionCookie = Cookies.get("public_token_cookie");
      if (!sessionCookie) {
        return { isAuthenticated: false, userName: "" };
      } else {
        const response = await axios.post(
          `${apiUrl}/api/refresh`,
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
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  },

  register: async (username, email, password, f_name, l_name) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/register`,
        { username, email, password, f_name, l_name },
        { withCredentials: true }
      );
      if (response.status === 201) {
        return response.data;
      } else {
        console.error("Registration failed:", response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      return error;
    }
  },

  isAuthenticated: async () => {
    try {
      const sessionCookie = Cookies.get("public_token_cookie");
      if (!sessionCookie) {
        console.log("No session cookie found");
        return { isAuthenticated: false, userName: "" };
      } else {
        // authService.refreshToken();
        const response = await axios.get(`${apiUrl}/api/auth`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          return {
            isAuthenticated: true,
            userName: response.data.username,
            role: response.data.role,
          };
        } else {
          return { isAuthenticated: false, userName: "" };
        }
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      return { isAuthenticated: false, userName: "" };
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        Cookies.remove("public_token_cookie");
        return true;
      }
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  },

  editUser: async (op, userid) => {
    // authService.refreshToken();
    try {
      const response = await axios.post(
        `${apiUrl}/api/useredit`,
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
