import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";

const ProductCard = (props) => {
  // const classes = useStyles();
  console.log("ProductCard:", props);
  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: "auto",
        borderRadius: 4,
        boxShadow: 13,
      }}
    >
      <CardMedia
        sx={{ height: 200 }}
        image={props.product.img_url}
        title={props.product.name}
      />
      <CardContent sx={{ textAlign: "left", padding: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          {props.name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ lineHeight: 1.8 }}
        >
          {props.product.description}
        </Typography>
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            ${props.product.price}
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
