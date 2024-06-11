import apiService from "../../components/api/apiService";
import React, { useState, useEffect } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../components/utils/CartWrapper";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAuth } from "../../components/utils/AuthContext";

const Checkout = () => {
  const { cartItemCount, cartItems, decCartItem, incCartItem } = useCart();
  const [cartList, setCartList] = useState([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    contactMethod: "email",
    requestedDate: null,
    cartItems: [],
    total: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      requestedDate: newDate,
    }));
  };

  const handleContactMethodChange = (event, newMethod) => {
    if (newMethod !== null) {
      setFormData((prevData) => ({
        ...prevData,
        contactMethod: newMethod,
      }));
    }
  };

  const calculateTotal = () => {
    return formData.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  useEffect(() => {
    fetchCartItems();
  }, [incCartItem, decCartItem]);

  const handleCheckout = () => {
    // Update the total in formData
    const updatedFormData = {
      ...formData,
      total: calculateTotal(),
    };

    // Navigate to the next step and pass the formData
    navigate("/order-details", { state: updatedFormData });
  };

  const fetchCartItems = async () => {
    try {
      const items = await apiService.getcartitems(cartItems);
      setCartList(items);
      setFormData((prevData) => ({
        ...prevData,
        cartItems: items,
      }));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

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
        </Box>
        <Box sx={{ marginTop: "10px" }}>
          <Box>
            <Box display="flex">
              <TextField
                label="First Name"
                variant="outlined"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                sx={{ paddingRight: "13px", paddingBottom: "10px" }}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                sx={{ paddingRight: "13px", paddingBottom: "10px" }}
              />
            </Box>
            <TextField
              label="Phone Number"
              variant="outlined"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              sx={{ paddingRight: "13px", paddingBottom: "10px" }}
            />

            <ToggleButtonGroup
              value={formData.contactMethod}
              exclusive
              onChange={handleContactMethodChange}
              aria-label="contact method"
            >
              <ToggleButton
                value="email"
                aria-label="email"
                sx={{
                  width: "100px",
                  paddingRight: "13px",
                  paddingTop: "18px",
                }}
              >
                Email
              </ToggleButton>
              <ToggleButton
                value="sms"
                aria-label="sms"
                sx={{
                  width: "100px",
                  paddingRight: "13px",
                  paddingTop: "18px",
                }}
              >
                SMS
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Typography variant="h6">Requested Date</Typography>
          <DatePicker
            value={formData.requestedDate}
            onChange={handleDateChange}
          />
        </Box>
        <Box sx={{ mt: 4, textAlign: "right" }}>
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
