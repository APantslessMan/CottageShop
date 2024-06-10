import React, { useContext, useState, useEffect } from "react";

import ProductCards from "./components/ProductCards";
import Information from "./components/Information";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import ApiDataFetch from "../../components/api/ApiDataFetch"; // Adjust the import as per your file structure
import Hero from "./components/Hero";
import Story from "./components/Story";
import { DataContext } from "../../components/utils/DataContext";

//fixed the import path
const Home = () => {
  const [formattedData, setFormattedData] = useState({});
  const [loading, setLoading] = useState(true);
  const { siteData, fetchData } = useContext(DataContext);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await ApiDataFetch.main({ type: "home" });
  //     const newFormattedData = {};

  //     Object.keys(data).forEach((key) => {
  //       const [prefix, component] = key.split("_");
  //       if (!newFormattedData[component]) {
  //         newFormattedData[component] = {};
  //       }
  //       newFormattedData[component] = data[key];
  //     });

  //     setFormattedData(newFormattedData);
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, []);

  // if (loading) {
  //   return <div>Loading...</div>; // Or some kind of loading spinner
  // }
  // useEffect(() => {
  //   fetchData(); // Fetch home page data on component mount
  // }, [fetchData]);

  if (!siteData) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div>
      {siteData.home_hero ? <Hero {...siteData.home_hero} /> : null}
      {/* {console.log("consolesiteData", siteData.products)} */}
      {siteData.home_story ? <Story {...siteData.home_story} /> : null}
      {siteData.home_products ? (
        <ProductCards {...siteData.home_products} />
      ) : null}
      {siteData.home_information ? (
        <Information {...siteData.home_information} />
      ) : null}
      {siteData.home_testimonials ? (
        <Testimonials {...siteData.home_testimonials} />
      ) : null}
      {siteData.home_contact ? <Contact {...siteData.home_contact} /> : null}
    </div>
  );
};

export default Home;
