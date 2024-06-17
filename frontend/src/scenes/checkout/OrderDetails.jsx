import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Paper, Box, Typography, Button, Grid, Divider } from "@mui/material";
import dayjs from "dayjs";

import apiService from "../../components/api/apiService";
import { useSnackbar } from "../../components/utils/SbProvider";
import { useCart } from "../../components/utils/CartWrapper";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const location = useLocation();
  const formData = location.state || {};
  const { showSnackbar } = useSnackbar();
  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    contactMethod,
    requestedDate,
    cartItems,
    total,
    comments,
  } = formData;

  const formattedDate = dayjs(requestedDate);

  const handleSubmit = async () => {
    const response = await apiService.submitorder(formData);
    console.log("response:", response);
    if (response.status === 201) {
      showSnackbar("Order Placed", "success");

      clearCart();
      navigate("/");
    } else {
      showSnackbar("Order Creation Failed", "error");
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
          Order Details
        </Typography>
        <Divider
          variant="middle"
          sx={{
            height: "2px",
            backgroundColor: "primary.main",
            margin: "10px 0",
          }}
        />
        <Typography variant="h6" gutterBottom>
          When your order is received will contact you via the specified method
          for payment and delivery details. :)
        </Typography>
        <Divider
          variant="middle"
          sx={{
            height: "2px",
            backgroundColor: "primary.main",
            margin: "10px 0",
          }}
        />
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Personal Information</Typography>
          <Typography>First Name: {firstName}</Typography>
          <Typography>Last Name: {lastName}</Typography>
          <Typography>Phone Number: {phoneNumber}</Typography>
          <Typography>Contact Method: {contactMethod}</Typography>
          <Typography>
            Requested Date:{" "}
            {formattedDate.isValid()
              ? formattedDate.format("MMMM D, YYYY")
              : "Invalid Date"}
          </Typography>
          <Typography>Comments: {comments?.toString()}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Cart Items</Typography>
          <Grid container spacing={2}>
            {cartItems.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Paper sx={{ display: "flex", p: 2 }}>
                  <Box sx={{ flexShrink: 0 }}>
                    <img src={item.img_url} alt={item.name} width={100} />
                  </Box>
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    {/* <Typography variant="body2">{item.description}</Typography> */}
                  </Box>
                  <Box sx={{ textAlign: "right", flexGrow: 1 }}>
                    <Typography variant="h6">
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="h6">
                      Price: ${item.price * item.quantity}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h5">Total: ${total}</Typography>
        </Box>
        <Box sx={{ mt: 4, textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Submit Order
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderDetails;
