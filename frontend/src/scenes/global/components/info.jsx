import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";

const information = [
  {
    header: "Our Bakery",
    description:
      "We are a small sourdough home bakery dedicated to bringing you the finest handmade breads. Our passion for quality ingredients and traditional techniques is evident in every loaf we bake.",
    image: "https://source.unsplash.com/random/800x600?bread&1",
  },
  {
    header: "Our Process",
    description:
      "Our process begins with the best organic ingredients. We take our time with fermentation, ensuring each loaf has the perfect flavor and texture.",
    image: "https://source.unsplash.com/random/800x600?bread&2",
  },
  {
    header: "Our Mission",
    description:
      "Our mission is to provide our community with delicious, healthy bread. We believe in sustainability and support local farmers and producers.",
    image: "https://source.unsplash.com/random/800x600?bread&3",
  },
];

const Information = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Divider
        variant="middle" // Adjust the variant to change the appearance of the line (middle, fullWidth, inset)
        sx={{
          // Customize the styling using the sx prop
          height: "2px", // Adjust the height of the line
          backgroundColor: "primary.main", // Set the background color of the line
          margin: "40px 0", // Add margin for spacing
        }}
      />
      {information.map((info, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: index % 2 === 0 ? "row" : "row-reverse",
            mb: 6,
            alignItems: "center",
            minHeight: "296px",
          }}
        >
          <Box
            component="img"
            src={info.image}
            alt={info.header}
            sx={{
              width: { xs: "100%", md: "50%" },
              height: "auto",
              objectFit: "cover",
              minHeight: "294px",
            }}
          />
          <Box
            sx={{
              padding: 4,
              width: { xs: "100%", md: "50%" },
              textAlign: index % 2 === 0 ? "left" : "right",
              backgroundColor: "background",
              minHeight: "294px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              {info.header}
            </Typography>
            <Typography variant="body1" component="p">
              {info.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Container>
  );
};

export default Information;
