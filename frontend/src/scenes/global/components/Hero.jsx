import React from "react";
import { Typography, Grid } from "@mui/material";

const Hero = () => {
  return (
    <Grid container alignItems="center">
      <Grid item xs={6}>
        <Typography variant="h2">Welcome to Our Website</Typography>
      </Grid>
      <Grid item xs={6}>
        <img
          src="./assets/img/hero.jpg"
          alt="Hero"
          style={{ width: "100%", display: "block" }}
          className="hero-image"
        />
      </Grid>
    </Grid>
  );
};

export default Hero;
