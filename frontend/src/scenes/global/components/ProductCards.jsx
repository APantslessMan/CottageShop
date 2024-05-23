import React from "react";
import { Grid } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductCards = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ProductCard />
      </Grid>
      {/* Add more ProductCard components here */}
    </Grid>
  );
};

export default ProductCards;
