import React, { useState, useEffect } from "react";
import { Paper, Typography, Tabs, Tab } from "@mui/material";
// import authService from "../../../components/api/authService";
import TitleTab from "./TitleTab";
import StoryTab from "./StoryTab";
import ProductTab from "./ProductTab";
import InfoTab from "./InfoTab";
import TestimonialTab from "./TestimonialTab";
import ContactTab from "./ContactTab";
import ApiDataFetch from "../../../components/api/ApiDataFetch";
const SiteEditor = ({ showSb }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [formattedData, setFormattedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await ApiDataFetch.main({ type: "home" });
      const newFormattedData = {};
      console.log("data", data);
      Object.keys(data).forEach((key) => {
        const [prefix, component] = key.split("_");
        if (!newFormattedData[component]) {
          newFormattedData[component] = {};
        }
        newFormattedData[component] = data[key];
      });

      setFormattedData(newFormattedData);
      setLoading(false);
    };
    fetchData();
  }, []); // Add an empty dependency array to the useEffect hook

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  if (loading) {
    return (
      <Paper
        style={{
          padding: 2,

          minHeight: "80vh",
          marginTop: "72px",
        }}
        elevation={7}
      >
        {" "}
        <div>Loading...</div>
      </Paper>
    );
  }

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
        <Tab label="Title" />
        <Tab label="Story" />
        <Tab label="Products" />
        <Tab label="Info" />
        <Tab label="Testimonials" />
        <Tab label="Contact" />
      </Tabs>
      <div>
        {selectedTab === 0 && <TitleTab {...formattedData.hero} />}
        {selectedTab === 1 && <StoryTab />}
        {selectedTab === 2 && <ProductTab />}
        {selectedTab === 3 && <InfoTab />}
        {selectedTab === 4 && <TestimonialTab />}
        {selectedTab === 5 && <ContactTab />}
      </div>
    </Paper>
  );
};

export default SiteEditor;
