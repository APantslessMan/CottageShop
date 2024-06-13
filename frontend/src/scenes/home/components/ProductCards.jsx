import React from "react";
import { Grid, Divider, Box, Container, Typography } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductCards = (products) => {
  if (!products) {
    return <div>No products available</div>;
  }

  return (
    <section>
      <Container maxWidth="lg">
        <Box py={8}>
          <Box sx={{ marginTop: "150px" }}>
            <Typography variant="h1" component="h2">
              Hot Items
            </Typography>{" "}
            <Divider
              variant="middle"
              sx={{
                height: "2px",
                backgroundColor: "primary.main",
                margin: "20px 0px",
              }}
            />
          </Box>
          <Grid container spacing={6}>
            {Object.keys(products).map((key) => (
              <Grid item xs={12} lg={4} key={key}>
                <ProductCard product={products[key]} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </section>
  );
};

export default ProductCards;
