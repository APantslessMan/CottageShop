import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import apiService from "../../../components/api/apiService";

const AddStockForm = () => {
  const [stockData, setStockData] = useState({
    name: "",
    description: "",
    supplier: "",
    price: "",
    qty: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStockData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", stockData.name);
      formData.append("description", stockData.description);
      formData.append("price", stockData.price);
      formData.append("supplier", stockData.supplier);
      formData.append("qty", stockData.qty);
      formData.append("op", "add");
      await apiService.editStock(null, formData);
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Box display="flex" mb={2}>
        <Box flex={1} mr={2}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={stockData.name}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={stockData.description}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={stockData.price}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Supplier"
            name="supplier"
            value={stockData.supplier}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Quantity"
            name="qty"
            type="number"
            value={stockData.qty}
            onChange={handleInputChange}
          />
        </Box>
      </Box>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default AddStockForm;
