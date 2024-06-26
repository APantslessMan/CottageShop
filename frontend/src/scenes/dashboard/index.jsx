import React, { useState } from "react";
import AdminSidebar from "./sidebar";
import Panel from "./utils/panel";
import { Box } from "@mui/material";

const Dashboard = ({ showSb }) => {
  const [selectedItem, setSelectedItem] = useState("Dashboard");

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <Box display="flex" sx={{ border: 0 }}>
      <AdminSidebar
        handleItemClick={handleItemClick}
        selectedItem={selectedItem}
      />
      <Panel selectedItem={selectedItem} showSb={showSb} />
    </Box>
  );
};

export default Dashboard;
