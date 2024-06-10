import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const HeroContainer = styled(Box)(({ theme, img }) => ({
  position: "relative",
  height: "80vh",
  width: "100%",
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundImage: `url(${img})`,

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
  backgroundColor: "rgba(0, 0, 0, 0.5)",
}));

const Hero = (props) => {
  return (
    <HeroContainer img={props.img}>
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
  );
};

export default Hero;
