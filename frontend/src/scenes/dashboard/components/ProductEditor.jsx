import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import authService from "../../../components/api/authService";
import AddProductTab from "./AddProduct";

const ProductEditor = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Paper elevation={3}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Add Product" />
        <Tab label="Edit Product" />
        <Tab label="Add Stock" />
        <Tab label="Edit Stock" />
      </Tabs>
      <div>
        {selectedTab === 0 && <AddProductTab />}
        {selectedTab === 1 && <EditProductTab />}
        {selectedTab === 2 && <AddStockTab />}
        {selectedTab === 3 && <EditStockTab />}
      </div>
    </Paper>
  );
};

const EditProductTab = () => {
  return (
    <div>
      <Typography variant="h5">Edit Product</Typography>
      {/* Add your form for editing an existing product */}
    </div>
  );
};

const AddStockTab = () => {
  return (
    <div>
      <Typography variant="h5">Add Stock</Typography>
      {/* Add your form for adding stock */}
    </div>
  );
};

const EditStockTab = () => {
  return (
    <div>
      <Typography variant="h5">Edit Stock</Typography>
      {/* Add your form for editing existing stock */}
    </div>
  );
};

export default ProductEditor;
