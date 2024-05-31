import React from "react";
import Hero from "./global/components/Hero";
import ProductCards from "./global/components/ProductCards";
import Testimonials from "./global/components/testimonials";
import Contact from "./global/components/contact";
import Story from "./global/components/Story";

import "../css/home.css";

const Home = () => {
  return (
    <div>
      <Hero />
      <Story />
      <ProductCards />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Home;
