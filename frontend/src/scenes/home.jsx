import React from "react";
import Hero from "./global/components/Hero";
import ProductCards from "./global/components/ProductCards";
import Testimonials from "./global/components/testimonials";
import Contact from "./global/components/contact";
import "../css/home.css";

const Home = () => {
  return (
    <div>
      <Hero />
      <ProductCards />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Home;
