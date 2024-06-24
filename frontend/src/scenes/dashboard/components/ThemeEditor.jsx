import React, { useState } from "react";
import { Paper, Typography, Tabs, Tab } from "@mui/material";
import ThemeModeEditor from "./ThemeModeEditors";
const ThemeEditor = () => {
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
        <Tab label="Dark Mode" />
        <Tab label="Light Mode" />
      </Tabs>
      <div>
        {selectedTab === 0 && <ThemeModeEditor />}
        {selectedTab === 1 && <ThemeModeEditor />}
      </div>
    </Paper>
  );
};

export default ThemeEditor;
