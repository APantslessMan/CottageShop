import React from "react";
import { Grid, Divider, Box, Container } from "@mui/material";
import ProductCard from "./ProductCard";

const product = {
  name: "Sourdough Bread",
  image: "https://source.unsplash.com/featured/?bread",
  description:
    "A delightful sourdough bread with a crispy crust and soft interior.",
  price: 8.99,
};

const ProductCards = () => {
  return (
    <section>
      <Container maxWidth="lg">
        <Box py={8}>
          <Box sx={{ marginTop: "90px" }}>
            {" "}
            <Divider
              variant="middle" // Adjust the variant to change the appearance of the line (middle, fullWidth, inset)
              sx={{
                // Customize the styling using the sx prop
                height: "2px", // Adjust the height of the line
                backgroundColor: "primary.main", // Set the background color of the line
                margin: "80px 0px", // Add margin for spacing
              }}
            />
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12} lg={4}>
              <ProductCard product={product} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <ProductCard product={product} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <ProductCard product={product} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </section>
  );
};

export default ProductCards;
