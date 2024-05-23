import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const Hero = () => {
  return (
    <Paper
      elevation={10}
      sx={{
        // border: "solid 1px",
        margin: "40px 40px 40px 40px",
        padding: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          <Typography variant="h1">
            Welcome to <br />
            CottageShop
          </Typography>
        </Box>
        <Box
          sx={{
            width: "50vw", // 40% of the viewport width
            // height: "40vw", // Same as width to maintain aspect ratio
          }}
        >
          <img
            src="./assets/img/hero.jpg"
            alt="Hero"
            style={{ width: "100%", display: "block" }}
            padding="20px"
            className="hero-image"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default Hero;
