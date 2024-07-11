import axios from "axios";
// import Cookies from "js-cookie";
import authService from "./authService";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "";
// TODO: Refactor to deduplicate code by use dynamic endpoints
const apiService = {
  editProduct: async (op, id = null, formData = null) => {
    try {
      authService.refreshToken().then(console.log("Token refreshed"));

      if (op === "add" && formData) {
        const response = await axios.post(
          `${apiUrl}/api/editproduct`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          console.log("Product added successfully");
        } else {
          console.error("Failed to add product");
        }
      } else if (op === "del" || op === "edit") {
        const response = await axios.post(
          `${apiUrl}/api/products`,
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
        const response = await axios.get(`${apiUrl}/api/products`, {
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
  editsite: async (formData) => {
    try {
      // authService.refreshToken();
      const response = await axios.post(`${apiUrl}/api/json/edit`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        console.log("Site settings updated successfully");
      } else {
        console.error("Failed to update site settings");
      }
    } catch (error) {
      console.error("Error during site settings editing:", error);
      throw error;
    }
  },

  listProducts: async () => {
    try {
      // await authService.refreshToken();
      const response = await axios.get(`${apiUrl}/api/listproducts`);
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
  editUser: async (action, id, column = null, item = null) => {
    // authService.refreshToken();
    try {
      const response = await axios.post(
        `${apiUrl}/api/editUser`,
        {
          action,
          id,
          ...(column != null && { column }),
          ...(item != null && { item }),
        },
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
    // authService.refreshToken();
    try {
      const response = await axios.post(`${apiUrl}/api/editstock`, formData, {
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
  getcart: async (user) => {
    try {
      // authService.refreshToken();
      const response = await axios.post(
        `${apiUrl}/api/cart`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch {
      console.error("Error getting cart:", error);
      throw error;
    }
  },
  addcart: async (op, product, quantity) => {
    try {
      // authService.refreshToken();
      const response = await axios.post(
        `${apiUrl}/api/cart`,
        { op, product, quantity },
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        console.log("Product added to cart successfully");
      } else {
        throw new Error(response.data.message);
      }
    } catch {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },
  delcart: async (op, product) => {
    try {
      // authService.refreshToken();
      const response = await axios.post(
        `${apiUrl}/api/cart`,
        { op, product },
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        console.log("Product removed from cart successfully");
      } else {
        throw new Error(response.data.message);
      }
    } catch {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },
  clearcart: async (op, userName) => {
    try {
      // authService.refreshToken();
      const response = await axios.post(
        `${apiUrl}/api/cart`,
        { op: "clear", userName },
        {
          withCredentials: true,
        }
      );
    } catch {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },
  // Get Cart For cart modal,no JWT required for this route
  getcartitems: async (items) => {
    try {
      // authService.refreshToken();

      const response = await axios.post(`${apiUrl}/api/cartitems`, { items });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch {
      console.error("Error getting cart items:", error);
      throw error;
    }
  },

  submitorder: async (formData) => {
    try {
      // authService.refreshToken();

      const response = await axios.post(`${apiUrl}/api/submitorder`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        return response;
      } else {
        throw new Error(response.data.message);
      }
    } catch {
      console.error("Error submitting order:", error);
      return error;
    }
  },
  editcategory: async (formData) => {
    try {
      // authService.refreshToken();

      const response = await axios.post(`${apiUrl}/api/site/cat`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 201) {
        return response;
      } else {
        throw new Error(response.data.message);
      }
    } catch {
      console.error("Error submitting order:", error);
      return error;
    }
  },
};
export default apiService;
