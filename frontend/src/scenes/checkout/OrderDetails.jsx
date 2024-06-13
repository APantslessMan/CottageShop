import React from "react";
import { useLocation } from "react-router-dom";
import { Paper, Box, Typography, Button, Grid, Divider } from "@mui/material";
import dayjs from "dayjs";

const OrderDetails = () => {
  const location = useLocation();
  const formData = location.state || {};

  const {
    email,
    firstName,
    lastName,
    phoneNumber,
    contactMethod,
    requestedDate,
    cartItems,
    total,
  } = formData;

  const formattedDate = requestedDate
    ? dayjs(requestedDate).format("MM-DD")
    : "N/A";

  const handleSubmit = () => {
    const submissionData = {
      ...formData,
      requestedDate: formattedDate,
    };
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
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Personal Information</Typography>
          <Typography>First Name: {firstName}</Typography>
          <Typography>Last Name: {lastName}</Typography>
          <Typography>Phone Number: {phoneNumber}</Typography>
          <Typography>Contact Method: {contactMethod}</Typography>
          <Typography>Requested Date: {formattedDate?.toString()}</Typography>
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
