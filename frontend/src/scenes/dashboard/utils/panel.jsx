import React, { useEffect } from "react";
import { Box } from "@mui/material";
import UserEditor from "../components/UserEditor";
import ProductEditor from "../components/ProductEditor";
import SiteEditor from "../components/SiteEditor";
import OrderEditor from "../components/OrderEditor";
import ThemeEditor from "../components/ThemeEditor";

const Panel = ({ selectedItem, showSb }) => {
  useEffect(() => {}, [selectedItem]);

  const renderContent = () => {
    switch (selectedItem) {
      case "userManagement":
        return <UserEditor showSb={showSb} />;
      case "productManagement":
        return <ProductEditor showSb={showSb} />;
      case "homeSettings":
        return <SiteEditor showSb={showSb} />;
      case "orderEditor":
        return <OrderEditor showSb={showSb} />;
      case "themeEditor":
        return <ThemeEditor showSb={showSb} />;
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
