import React, { useState, useEffect } from "react";

import ProductCards from "./global/components/ProductCards";
import Information from "./global/components/Information";
import Testimonials from "./global/components/Testimonials";
import Contact from "./global/components/Contact";
import ApiDataFetch from "../components/api/ApiDataFetch"; // Adjust the import as per your file structure
import Hero from "./global/components/Hero";
import Story from "./global/components/Story";
//fixed the import path
const Home = () => {
  const [formattedData, setFormattedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await ApiDataFetch.main({ type: "home" });
      const newFormattedData = {};

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
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or some kind of loading spinner
  }

  return (
    <div>
      {formattedData.hero ? <Hero {...formattedData.hero} /> : null}
      {console.log("consoleformattedData", formattedData.products)}
      {formattedData.story ? <Story {...formattedData.story} /> : null}
      {formattedData.products ? (
        <ProductCards {...formattedData.products} />
      ) : null}
      {formattedData.information ? (
        <Information {...formattedData.information} />
      ) : null}
      {formattedData.testimonials ? (
        <Testimonials {...formattedData.testimonials} />
      ) : null}
      {formattedData.contact ? <Contact {...formattedData.contact} /> : null}
    </div>
  );
};

export default Home;
