import React, { useState, useEffect } from "react";
import { Modal, Button, Typography, Box, Badge } from "@mui/material";
import apiService from "../../components/api/apiService"; // Import API service for fetching cart items
import { useCart } from "../../components/utils/CartWrapper";
import { ShoppingCartOutlined } from "@mui/icons-material";

const CartModal = ({ open, onClose }) => {
  const [cartList, setCartList] = useState([]); // Add this line
  const { cartItemCount, cartItems, decCartItem, incCartItem } = useCart();

  useEffect(() => {
    if (open) {
      // Fetch cart items from the database when the modal opens
      fetchCartItems();
    }
  }, [open, incCartItem, decCartItem]);

 const fetchCartItems = async () => {
    try {
      const items = await apiService.getcartitems(cartItems); // Adjust this based on your API
      console.log("Cart items:", items);
      setCartList(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography variant="h6" component="h2">
          Your Cart
        </Typography>

        {cartList.map((item) => (
          <Box key={item.id} display="flex" alignItems="center" mb={1}>
            {console.log("Item in jsx:", item)}
            <img
              src={item.img_url}
              alt={item.name}
              style={{ marginRight: "8px", width: "50px" }}
            />
            <Typography variant="body1">{item.description}</Typography>
            <Button
              onClick={() => {
                decCartItem(item.id);
                
              }}
            >
              -
            </Button>
            <Typography>{item.quantity}</Typography>
            <Button>+</Button>
          </Box>
        ))}
        <Button variant="contained" color="primary" fullWidth>
          Checkout
        </Button>
      </Box>
    </Modal>
  );
};

export default CartModal;
