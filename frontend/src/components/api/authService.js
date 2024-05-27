import axios from "axios";
import Cookies from "js-cookie";

const apiUrl = process.env.REACT_APP_API_URL;
// const csrfToken = document
//   .querySelector('meta[name="csrf-token"]')
//   .getAttribute("content");

const authService = {
  login: async (login, password, email = null) => {
    const mode = "login";
    try {
      const endpoint = mode === "login" ? "/login" : "/refresh";
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
          localStorage.setItem("access_token", data.access_token);
          console.log("data", data);
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
  editUser: async (op, userid) => {
    try {
      const response = await axios.post(
        `${apiUrl}/useredit`,
        {
          op,
          userid,
        },
        {
          headers: {
            // "X-CSRF-TOKEN": csrfToken,
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          withCredentials: true, // Include cookies in the request
        }
      );

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error("Error during Useredit:", error);
      return { error: error.response.data.message };
    }
  },
};
export default authService;
