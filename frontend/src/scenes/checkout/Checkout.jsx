import apiService from "../../components/api/apiService"; // Import API service for fetching cart items
import React, { useState, useEffect } from "react";
import { Paper, Box, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../components/utils/CartWrapper";
// Sample cart items data

const cart = [
  {
    id: 1,
    img: "https://via.placeholder.com/150",
    title: "Item 1",
    description: "Description for item 1",
    price: 10.0,
    quantity: 2,
  },
  {
    id: 2,
    img: "https://via.placeholder.com/150",
    title: "Item 2",
    description: "Description for item 2",
    price: 15.0,
    quantity: 1,
  },
];

const Checkout = () => {
  const { cartItemCount, cartItems, decCartItem, incCartItem } = useCart();
  const [cartList, setCartList] = useState([]);
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartList.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  useEffect(() => {
    fetchCartItems();
  }, [incCartItem, decCartItem]);

  const handleCheckout = () => {
    // Navigate to the next step
    navigate("/next-step");
  };

  const fetchCartItems = async () => {
    try {
      const items = await apiService.getcartitems(cartItems);
      setCartList(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  console.log(cartList);
  return (
    <Box
      sx={{
        marginTop: "78px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(60vh - 72px)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: "800px",
          width: "100%",
          p: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Grid container spacing={2}>
          {cartList.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Paper sx={{ display: "flex", p: 2 }}>
                <Box sx={{ flexShrink: 0 }}>
                  <img src={item.img_url} alt={item.name} width={100} />
                </Box>
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">{item.description}</Typography>
                </Box>
                <Grid item>
                  <Button
                    onClick={() => {
                      decCartItem(item.id);
                    }}
                    sx={{ marginRight: "-10px" }}
                  >
                    <Typography variant="h3">-</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <Typography variant="h5" sx={{ paddingTop: "11px" }}>
                    {item.quantity}
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => {
                      incCartItem(item.id);
                    }}
                    sx={{ marginLeft: "-10px", paddingTop: "7px" }}
                  >
                    <Typography variant="h3">+</Typography>
                  </Button>
                  <Box sx={{ ml: 2, flexShrink: 0 }}>
                    <Typography variant="h6">
                      ${item.price * item.quantity}
                    </Typography>
                  </Box>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4, textAlign: "right" }}>
          <Typography variant="h5">Total: ${calculateTotal()}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleCheckout}
          >
            Proceed to Payment
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Checkout;
