import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Container,
  Divider,
} from "@mui/material";

const testimonials = [
  {
    name: "John Doe",
    image: "https://source.unsplash.com/random/100x100?person",
    feedback:
      "This sourdough bread is the best I’ve ever tasted! The crust is perfect and the inside is so soft and flavorful.",
  },
  {
    name: "Jane Smith",
    image: "https://source.unsplash.com/random/101x101?person",
    feedback:
      "Absolutely love the quality of the bread. You can really tell it’s made with love and care.",
  },
  {
    name: "Bob Johnson",
    image: "https://source.unsplash.com/random/102x102?person",
    feedback:
      "The best home bakery in town! Every product is a delight and keeps me coming back for more.",
  },
];

const Testimonials = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Divider
        variant="middle" // Adjust the variant to change the appearance of the line (middle, fullWidth, inset)
        sx={{
          // Customize the styling using the sx prop
          height: "2px", // Adjust the height of the line
          backgroundColor: "primary.main", // Set the background color of the line
          margin: "80px 0", // Add margin for spacing
        }}
      />
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 6 }}
      >
        What Our Customers Say
      </Typography>
      {testimonials.map((testimonial, index) => (
        <Card
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            p: 3,
            boxShadow: 3,
          }}
        >
          <Avatar
            src={testimonial.image}
            alt={testimonial.name}
            sx={{ width: 60, height: 60, mr: 3 }}
          />
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {testimonial.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {testimonial.feedback}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Testimonials;
