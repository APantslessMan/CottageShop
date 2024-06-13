import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "black", color: "ivory", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Typography variant="body2">
              We are a small sourdough home bakery dedicated to bringing you the
              finest handmade breads. Our passion for quality ingredients and
              traditional techniques is evident in every loaf we bake.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            {/* <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link
                href="/"
                color="inherit"
                underline="hover"
                sx={{ display: "block", mb: 1 }}
              >
                Home
              </Link>
              <Link
                href="/about"
                color="inherit"
                underline="hover"
                sx={{ display: "block", mb: 1 }}
              >
                About Us
              </Link>
              <Link
                href="/products"
                color="inherit"
                underline="hover"
                sx={{ display: "block", mb: 1 }}
              >
                Products
              </Link>
              <Link
                href="/contact"
                color="inherit"
                underline="hover"
                sx={{ display: "block", mb: 1 }}
              >
                Contact Us
              </Link>
            </Box> */}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body2">
              In the beautiful Bulkley Valley
              <br />
              Houston, BC V0J 1Z2
              <br />
              Phone: (778) 533-4972
              <br />
              Email: info@littleacres.ca
            </Typography>
          </Grid>
        </Grid>
        <Box mt={4} textAlign="center">
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Little Acres. All rights reserved.
            Powered by CottageShop
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
