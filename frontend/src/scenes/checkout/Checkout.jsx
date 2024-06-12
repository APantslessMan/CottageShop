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
  Divider,
  Tooltip,
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
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    contactMethod: "email",
    requestedDate: null,
    cartItems: [],
    total: 0,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "phoneNumber") {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));

    // Validate input
    validateField(name, formattedValue);
  };

  const handleDateChange = (newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      requestedDate: newDate,
    }));
    if (!newDate) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        requestedDate: "Please select a requested date.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        requestedDate: "",
      }));
    }
  };

  const handleContactMethodChange = (event, newMethod) => {
    if (newMethod !== null) {
      setFormData((prevData) => ({
        ...prevData,
        contactMethod: newMethod,
      }));
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, ""); // Remove all non-digit characters
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (match) {
      const part1 = match[1];
      const part2 = match[2] ? `-${match[2]}` : "";
      const part3 = match[3] ? `-${match[3]}` : "";
      return `${part1}${part2}${part3}`;
    }

    return value;
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        error = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Invalid email address."
          : "";
        break;
      case "firstName":
      case "lastName":
        error = value.trim() === "" ? "This field is required." : "";
        break;
      case "phoneNumber":
        error = !/^\d{3}-\d{3}-\d{4}$/.test(value)
          ? "Phone number must be in the format 123-123-4567."
          : "";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
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
    const { email, firstName, lastName, phoneNumber, requestedDate } = formData;
    if (!email || !firstName || !lastName || !phoneNumber || !requestedDate) {
      setErrors({
        email: !email ? "Email is required." : "",
        firstName: !firstName ? "First name is required." : "",
        lastName: !lastName ? "Last name is required." : "",
        phoneNumber: !phoneNumber ? "Phone number is required." : "",
        requestedDate: !requestedDate ? "Requested date is required." : "",
      });
      return;
    }
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
        <Typography variant="h3">Checkout</Typography>
        <Divider
          variant="middle"
          sx={{
            height: "2px",
            backgroundColor: "primary.main",
            margin: "10px 0",
          }}
        />
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
        <Box sx={{ marginBottom: "40px", mt: 4, textAlign: "right" }}>
          <Typography variant="h5">Total: ${calculateTotal()}</Typography>
        </Box>
        <Typography variant="h3">Customer Details</Typography>
        <Divider
          variant="middle"
          sx={{
            height: "2px",
            backgroundColor: "primary.main",
            margin: "10px 0",
          }}
        />
        <Box sx={{ marginTop: "10px" }}>
          <Box>
            <Box>
              <Tooltip title={errors.email || ""} open={!!errors.email} arrow>
                <TextField
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  sx={{ paddingRight: "13px", paddingBottom: "10px" }}
                  error={!!errors.email}
                />
              </Tooltip>
              <br />
              <Tooltip
                title={errors.firstName || ""}
                open={!!errors.firstName}
                arrow
              >
                <TextField
                  label="First Name"
                  variant="outlined"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  sx={{ paddingRight: "13px", paddingBottom: "10px" }}
                  error={!!errors.firstName}
                />
              </Tooltip>
              <Tooltip
                title={errors.lastName || ""}
                open={!!errors.lastName}
                arrow
              >
                <TextField
                  label="Last Name"
                  variant="outlined"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  sx={{ paddingRight: "13px", paddingBottom: "10px" }}
                  error={!!errors.lastName}
                />
              </Tooltip>
            </Box>
            <Tooltip
              title={errors.phoneNumber || ""}
              open={!!errors.phoneNumber}
              arrow
            >
              <TextField
                label="Phone Number"
                variant="outlined"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                sx={{ paddingRight: "13px", paddingBottom: "10px" }}
                error={!!errors.phoneNumber}
              />
            </Tooltip>

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
          <Tooltip
            title={errors.requestedDate || ""}
            open={!!errors.requestedDate}
            arrow
          >
            <DatePicker
              value={formData.requestedDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.requestedDate}
                  helperText={errors.requestedDate}
                />
              )}
            />
          </Tooltip>
        </Box>
        <Divider
          variant="middle"
          sx={{
            height: "2px",
            backgroundColor: "primary.main",
            margin: "30px 0",
            marginBottom: "-5px",
          }}
        />
        <Box sx={{ textAlign: "right" }}>
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
