import axios from "axios";
// import Cookies from "js-cookie";
import authService from "./authService";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "";

const apiService = {
  editProduct: async (op, id = null, formData = null) => {
    try {
      authService.refreshToken().then(console.log("Token refreshed"));

      if (op === "add" && formData) {
        const response = await axios.post(`${apiUrl}/editproduct`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          console.log("Product added successfully");
        } else {
          console.error("Failed to add product");
        }
      } else if (op === "del" || op === "edit") {
        const response = await axios.post(
          `${apiUrl}/products`,
          { op, id },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response.status === 201) {
          console.log("Product added successfully");
        } else {
          console.error("Failed to add product");
        }
      } else if (op === "list") {
        const response = await axios.get(`${apiUrl}/products`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log(response.data);
          return response.data;
        } else {
          console.error("Failed to Fetch products");
        }
      }
    } catch (error) {
      console.error("Error during product editing:", error);
      throw error;
    }
  },
  listProducts: async () => {
    try {
      await authService.refreshToken();
      const response = await axios.post(
        `${apiUrl}/products`,
        { op: "list" },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  // addProduct:
  // deleteProduct:
  editUser: async (action, id) => {
    authService.refreshToken();
    try {
      const response = await axios.post(
        `${apiUrl}/editUser`,
        { action, id },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        return response;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      throw error;
    }
  },
  editStock: async (id = null, formData = null) => {
    authService.refreshToken();
    try {
      const response = await axios.post(`${apiUrl}/editstock`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        console.log("Stock added successfully");
      } else {
        console.error("Failed to add stock");
      }
    } catch (error) {
      console.error("Error during stock editing:", error);
      throw error;
    }
  },

  // addUser:
  // deleteUser:
};
export default apiService;
