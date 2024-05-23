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
          Cookies.set("access_token_cookie", data.access_token, { path: "/" });
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
      console.log(`${apiUrl}/role`);
      const response = await axios.get(`${apiUrl}/role`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Role response:", response.data.role);
        return response.data.role;
      } else {
        throw new Error("Failed to get role");
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      throw error;
    }
  },
};

export default authService;
