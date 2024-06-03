import React, { useState } from "react";
import { Paper, Typography, Tabs, Tab } from "@mui/material";
// import authService from "../../../components/api/authService";
import AddProductTab from "./AddProduct";
import ShowProduct from "./ShowProduct";
import AddStockTab from "./AddStock";

const ProductEditor = ({ showSb }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Paper
      style={{
        padding: 2,

        minHeight: "80vh",
        marginTop: "72px",
      }}
      elevation={7}
    >
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
        {selectedTab === 1 && <ShowProduct showSb={showSb} />}
        {selectedTab === 2 && <AddStockTab />}
        {selectedTab === 3 && <EditStockTab />}
      </div>
    </Paper>
  );
};

// const AddStockTab = () => {
//   return (
//     <div>
//       <Typography variant="h5">Add Stock</Typography>
//       {/* Add your form for adding stock */}
//     </div>
//   );
// };

const EditStockTab = () => {
  return (
    <div>
      <Typography variant="h5">Edit Stock</Typography>
      {/* Add your form for editing existing stock */}
    </div>
  );
};

export default ProductEditor;
