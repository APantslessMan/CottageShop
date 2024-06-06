import React from "react";
import { Grid, Divider, Box, Container, Typography } from "@mui/material";
import ProductCard from "./ProductCard";

const ProductCards = (props) => {
  return (
    <section>
      <Container maxWidth="lg">
        <Box py={8}>
          <Box sx={{ marginTop: "150px" }}>
            <Typography variant="h1" component="h2">
              Hot Items
            </Typography>{" "}
            <Divider
              variant="middle" // Adjust the variant to change the appearance of the line (middle, fullWidth, inset)
              sx={{
                // Customize the styling using the sx prop
                height: "2px", // Adjust the height of the line
                backgroundColor: "primary.main", // Set the background color of the line
                margin: "20px 0px", // Add margin for spacing
              }}
            />
          </Box>
          <Grid container spacing={6}>
            {Object.keys(props).map((product) => (
              <Grid item xs={12} lg={4}>
                <ProductCard product={props[product]} />

                {/* {console.log("ProductCards:", props[product])} */}
              </Grid>
            ))}{" "}
          </Grid>
        </Box>
      </Container>
    </section>
  );
};

export default ProductCards;
