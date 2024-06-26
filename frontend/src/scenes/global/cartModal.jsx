import React, { useState, useEffect } from "react";
import { Modal, Button, Typography, Box, Badge, Grid } from "@mui/material";
import apiService from "../../components/api/apiService";
import { useCart } from "../../components/utils/CartWrapper";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/utils/AuthContext";

const CartModal = ({ open, onClose }) => {
  const { isLoggedIn } = useAuth();
  const [cartList, setCartList] = useState([]);
  const { cartItemCount, cartItems, decCartItem, incCartItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchCartItems();
    }
  }, [open, incCartItem, decCartItem]);

  const onCheckout = () => {
    onClose();
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  const fetchCartItems = async () => {
    try {
      const items = await apiService.getcartitems(cartItems);

      setCartList(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  const calculateTotalPrice = () => {
    return cartList.reduce((total, item) => {
      const price = parseFloat(item.price);

      return total + price * item.quantity;
    }, 0);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          width: 450,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h3" component="h2" sx={{ marginBottom: "50px" }}>
          Your Cart
        </Typography>

        {cartList.map((item) => (
          <Grid
            container
            spacing={2}
            alignItems="center"
            key={item.id}
            sx={{ marginTop: "10px" }}
          >
            <Grid item xs={3}>
              <img
                src={item.img_url}
                alt={item.name}
                style={{ width: "50px" }}
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">{item.name}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Grid container alignItems="center" spacing={0}>
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
                  <Typography variant="h5">{item.quantity}</Typography>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => {
                      incCartItem(item.id);
                    }}
                    sx={{ marginLeft: "-10px" }}
                  >
                    <Typography variant="h3">+</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Typography sx={{ textAlign: "right" }}>${item.price}</Typography>
            </Grid>
          </Grid>
        ))}
        <Typography variant="h4" component="h2" textAlign="right" margin="20px">
          Total: ${calculateTotalPrice().toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          onClick={onCheckout}
          color="primary"
          fullWidth
        >
          Checkout
        </Button>
      </Box>
    </Modal>
  );
};

export default CartModal;
