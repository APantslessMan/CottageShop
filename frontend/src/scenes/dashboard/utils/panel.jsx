import React, { useEffect } from "react";
import { Box } from "@mui/material";
import UserEditor from "../components/UserEditor";

const Panel = ({ selectedItem, showSb }) => {
  useEffect(() => {}, [selectedItem]);

  const renderContent = () => {
    switch (selectedItem) {
      case "userManagement":
        return <UserEditor showSb={showSb} />;
      case "productManagement":
        return <div>Product Management</div>;
      case "analytics":
        return <div>Analytics</div>;
      case "dashboard":
        return <div>Dashboard</div>;
      default:
        return <div>No content selected</div>;
    }
  };

  return (
    <Box flexGrow={1} p={2}>
      {renderContent()}
    </Box>
  );
};

export default Panel;