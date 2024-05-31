import React from "react";
import Hero from "./global/components/Hero";
import ProductCards from "./global/components/ProductCards";
import Testimonials from "./global/components/testimonials";
import Contact from "./global/components/contact";
import Story from "./global/components/Story";

import "../css/home.css";
import Information from "./global/components/info";

const Home = () => {
  return (
    <div>
      <Hero />
      <Story />
      <ProductCards />
      <Information />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Home;
