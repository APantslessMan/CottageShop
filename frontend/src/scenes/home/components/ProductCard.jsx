import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useCart } from "../../../components/utils/CartWrapper";

const ProductCard = (props) => {
  const { product } = props;
  const { cartItemCount, incCartItem } = useCart();
  const handleAddToCart = () => {
    incCartItem(product.id);
  };

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
        image={product.img_url}
        title={product.name}
      />
      <CardContent sx={{ textAlign: "left", padding: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ lineHeight: 1.8 }}
        >
          {product.description}
        </Typography>
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            ${product.price}
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddToCart}
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
