import axios from "axios";
import authService from "./authService";

// Ensure apiUrl is defined or provide a fallback
const apiUrl = import.meta.env.VITE_API_BASE_URL || "";

const apiService = {
  editProduct: async (op, id = null, formData = null) => {
    try {
      // Refresh token before making the request
      await authService.refreshToken();

      // Handle different operations (add, del, edit)
      if (op === "add" && formData) {
        // Handle add product operation
        const response = await axios.post(`${apiUrl}/editproduct`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // Log success or error message
        if (response.status === 201) {
          console.log("Product added successfully");
        } else {
          console.error("Failed to add product");
        }
      } else if (op === "del" || op === "edit") {
        // Handle delete or edit product operation
        const response = await axios.post(
          `${apiUrl}/products`,
          { op, id },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        // Log success or error message
        if (response.status === 201) {
          console.log("Product edited successfully");
        } else {
          console.error("Failed to edit product");
        }
      }
    } catch (error) {
      console.error("Error during product editing:", error);
      throw error;
    }
  },
  listProducts: async () => {
    try {
      // Refresh token before making the request
      await authService.refreshToken();

      // Fetch list of products
      const response = await axios.get(`${apiUrl}/products`, {
        withCredentials: true,
      });
      // Log success or error message
      if (response.status === 200) {
        console.log(response.data);
        return response.data;
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
  editUser: async (action, id) => {
    try {
      // Refresh token before making the request
      await authService.refreshToken();

      // Handle user editing operation
      const response = await axios.post(
        `${apiUrl}/editUser`,
        { action, id },
        {
          withCredentials: true,
        }
      );
      // Log success or error message
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
    try {
      // Refresh token before making the request
      await authService.refreshToken();

      // Handle stock editing operation
      const response = await axios.post(`${apiUrl}/editstock`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Log success or error message
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
};

export default apiService;
