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

// const testimonials = [
//   {
//     name: "John Doe",
//     image: "https://source.unsplash.com/random/100x100?person",
//     feedback:
//       "This sourdough bread is the best I’ve ever tasted! The crust is perfect and the inside is so soft and flavorful.",
//   },
//   {
//     name: "Jane Smith",
//     image: "https://source.unsplash.com/random/101x101?person",
//     feedback:
//       "Absolutely love the quality of the bread. You can really tell it’s made with love and care.",
//   },
//   {
//     name: "Bob Johnson",
//     image: "https://source.unsplash.com/random/102x102?person",
//     feedback:
//       "The best home bakery in town! Every product is a delight and keeps me coming back for more.",
//   },
// ];

const Testimonials = (props) => {
  const modTestimonials = Object.keys(props)
    .map((name) => {
      if (name !== "uuid") {
        return {
          name,
          feedback: props[name],
        };
      }
      return null; // Return null for items that don't have a valid props[name]
    })
    .filter(Boolean); // Filter out null values

  console.log("Testimonials:", props);
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ marginTop: "100px" }}>
        {" "}
        <Divider
          variant="middle" // Adjust the variant to change the appearance of the line (middle, fullWidth, inset)
          sx={{
            // Customize the styling using the sx prop
            height: "2px", // Adjust the height of the line
            backgroundColor: "primary.main", // Set the background color of the line
            margin: "16px 0", // Add margin for spacing
          }}
        />
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 6 }}
          >
            What Our Customers Say
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          {modTestimonials.map((testimonial, index) => (
            <Card key={index} sx={{ mb: 4 }}>
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
