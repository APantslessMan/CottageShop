import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";

const HeroContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "100vh",
  width: "100%",
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundImage: "url(./assets/img/hero.jpg)",

  [theme.breakpoints.down("md")]: {
    height: "75vh",
  },
  [theme.breakpoints.down("sm")]: {
    height: "50vh",
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  color: "#fff",
  padding: theme.spacing(2),
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Add a background color with transparency to improve text readability
}));

const Hero = () => {
  return (
    // <Paper
    //   elevation={10}
    //   sx={{
    //     // border: "solid 1px",
    //     margin: "40px 40px 40px 40px",
    //     padding: "10px",
    //   }}
    // >
    <HeroContainer>
      <HeroContent>
        <Typography variant="h2" component="h1">
          Welcome to Our Site
        </Typography>
        <Typography variant="h5" component="p">
          Your catchy tagline goes here
        </Typography>
      </HeroContent>
    </HeroContainer>
    // <Box
    //   sx={{
    //     display: "flex",
    //     alignItems: "center",
    //   }}
    // >
    //   <Box sx={{ flexGrow: 1, textAlign: "center" }}>
    //     <Typography variant="h1">
    //       Welcome to <br />
    //       CottageShop
    //     </Typography>
    //   </Box>
    //   <Box
    //     sx={{
    //       width: "50vw", // 40% of the viewport width
    //       // height: "40vw", // Same as width to maintain aspect ratio
    //     }}
    //   >
    //     <img
    //       src="./assets/img/hero.jpg"
    //       alt="Hero"
    //       style={{ width: "100%", display: "block" }}
    //       padding="20px"
    //       className="hero-image"
    //     />
    //   </Box>
    // </Box>
    // // </Paper>
  );
};

export default Hero;
