import React, { useContext, useState } from "react";
import ProductCards from "./components/ProductCards";
import Information from "./components/Information";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import Story from "./components/Story";
import { DataContext } from "../../components/utils/DataContext";

const Home = () => {
  const [formattedData, setFormattedData] = useState({});
  const [loading, setLoading] = useState(true);
  const { siteData, fetchData } = useContext(DataContext);

  if (!siteData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {siteData.home_hero ? <Hero {...siteData.home_hero} /> : null}

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
