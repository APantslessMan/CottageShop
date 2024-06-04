import React from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL || "";

const ApiDataFetch = {
  main: async (queryParams) => {
    try {
      const response = await axios.post(`${apiUrl}/api/json`, queryParams);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
};

export default ApiDataFetch;
