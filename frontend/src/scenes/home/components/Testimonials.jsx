import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Container,
  Divider,
  Grid,
  Box,
} from "@mui/material";

const Testimonials = (props) => {
  const modTestimonials = Object.keys(props)
    .map((name) => {
      if (name !== "uuid") {
        return {
          name,
          feedback: props[name],
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ marginTop: "100px" }}>
        <Typography
          variant="h4"
          align="left"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          What Our Customers Say
        </Typography>{" "}
        <Divider
          variant="middle"
          sx={{
            height: "2px", // Adjust the height of the line
            backgroundColor: "primary.main", // Set the background color of the line
            margin: "16px 0", // Add margin for spacing
          }}
        />
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          {modTestimonials.map((testimonial, index) => (
            <Card key={index} sx={{ mb: 4 }} elevation={10}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {testimonial.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {testimonial.feedback}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Testimonials;
