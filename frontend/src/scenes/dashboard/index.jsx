import React, { useState } from "react";
import AdminSidebar from "../global/sidebar";
import Panel from "./utils/panel";
import { Box } from "@mui/material";

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  const handleItemClick = (item) => {
    setSelectedItem(item); // Here, item can be the entire object or a specific property
  };

  return (
    <Box display="flex">
      <AdminSidebar handleItemClick={handleItemClick} />
      <Panel selectedItem={selectedItem} />
    </Box>
  );
};

export default Dashboard;
