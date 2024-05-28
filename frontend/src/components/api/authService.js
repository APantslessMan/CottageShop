import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = process.env.REACT_APP_API_URL;

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
    const refreshToken = Cookies.get("refresh_token_cookie");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${apiUrl}/refresh`,
      {},
      {
        withCredentials: true,
      }
    );
    Cookies.set("access_token_cookie", response.data.access_token);
    return { isAuthenticated: true, userName: response.data.username };
  },

  register: async (username, email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/register`, {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
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
    try {
      const csrfToken = Cookies.get("csrf_token"); // Assuming you are using CSRF token from cookies
      const response = await axios.post(
        `${apiUrl}/useredit`,
        { op, userid },
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
            Authorization: `Bearer ${Cookies.get("access_token_cookie")}`,
          },
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
