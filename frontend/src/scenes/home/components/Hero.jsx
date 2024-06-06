import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const HeroContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "80vh",
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
  top: "75%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  // color: "#fff",
  padding: theme.spacing(4),
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Add a background color with transparency to improve text readability
}));

const Hero = (props) => {
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
        <Typography
          variant="h1"
          component="h1"
          fontFamily="Source Sans Pro"
          sx={{ fontSize: "8.2vh" }}
          color="secondary"
        >
          {props.title}
        </Typography>
        {/*TODO: change title to variable pulled from DB */}
        <Typography
          variant="h5"
          component="p"
          sx={{ fontSize: "3.2vh" }}
          color="secondary"
        >
          {props.sub}
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