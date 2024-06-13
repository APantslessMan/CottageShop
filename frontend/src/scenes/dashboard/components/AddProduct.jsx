import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import apiService from "../../../components/api/apiService";
const apiUrl = import.meta.env.VITE_API_BASE_URL || "";

const AddProductForm = ({ showSb }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    img_url: "",
    stockItems: [{ item: "", quantity: "" }],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [stockOptions, setStockOptions] = useState([]);

  useEffect(() => {
    //TODO: switch to api service component
    const fetchStockItems = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/stock_items`);
        setStockOptions(response.data);
      } catch (error) {
        console.error("Error fetching stock items:", error);
      }
    };

    fetchStockItems();
  }, []);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newStockItems = [...productData.stockItems];
    newStockItems[index][name] = value;
    setProductData({ ...productData, stockItems: newStockItems });
  };

  const handleAddStockItem = () => {
    setProductData({
      ...productData,
      stockItems: [...productData.stockItems, { item: "", quantity: "" }],
    });
  };

  const handleRemoveStockItem = (index) => {
    const newStockItems = [...productData.stockItems];
    newStockItems.splice(index, 1);
    setProductData({ ...productData, stockItems: newStockItems });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("img_url", productData.img_url); // Add this only if you want to keep the URL option
      formData.append("image", imageFile); // Add the image file
      formData.append("stockItems", JSON.stringify(productData.stockItems));
      //TODO: switch to api service component
      await apiService.editProduct("add", null, formData);
      showSb(`Product Added`, "success");
      //   setProductData({
      //     name: "",
      //     description: "",
      //     price: "",
      //     img_url: "",
      //     stockItems: [{ item: "", quantity: "" }],
      //   });
    } catch (error) {
      console.error("Error adding product:", error);
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
            value={productData.name}
            onChange={(e) =>
              setProductData({ ...productData, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={productData.description}
            onChange={(e) =>
              setProductData({ ...productData, description: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={productData.price}
            onChange={(e) =>
              setProductData({ ...productData, price: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Image URL"
            name="img_url"
            value={productData.img_url}
            onChange={(e) =>
              setProductData({ ...productData, img_url: e.target.value })
            }
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </Box>
        <Box flex={1} textAlign="center">
          <Box
            mb={2}
            border={1}
            borderColor="primary.main"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="250px"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Product"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              <Typography variant="h6">Image Preview</Typography>
            )}
          </Box>
          <Box>
            <Typography variant="h6">Stock Items</Typography>
            {productData.stockItems.map((stockItem, index) => (
              <Box display="flex" alignItems="center" mb={1} key={index}>
                <Select
                  name="item"
                  value={stockItem.item}
                  onChange={(e) => handleInputChange(index, e)}
                  fullWidth
                  sx={{ mr: 1 }}
                >
                  {stockOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  name="quantity"
                  type="number"
                  label="Quantity"
                  value={stockItem.quantity}
                  onChange={(e) => handleInputChange(index, e)}
                  sx={{ mr: 1 }}
                />
                <Button onClick={() => handleRemoveStockItem(index)}>
                  Remove
                </Button>
              </Box>
            ))}
            <Button onClick={handleAddStockItem}>Add Stock Item</Button>
          </Box>
        </Box>
      </Box>
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
};

export default AddProductForm;
