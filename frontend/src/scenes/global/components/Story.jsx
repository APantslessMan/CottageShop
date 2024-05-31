import React from "react";
import { Box, Typography, Grid, Container, Divider } from "@mui/material";
// import { makeStyles } from "@mui/core/styles";

import StorageIcon from "@mui/icons-material/Storage";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ShutterSpeedIcon from "@mui/icons-material/ShutterSpeed";
import PublicIcon from "@mui/icons-material/Public";

export default function Story(props) {
  const content = {
    badge: "Our Story",
    header: "Our Story",
    "col1-header": "The Beginning",
    "col1-desc":
      "Our journey began in a cozy kitchen, where the smell of freshly baked bread filled the air and the warmth of the oven created a comforting atmosphere. What started as a hobby, driven by a love for the simple pleasure of baking, quickly transformed into a passion. The process of nurturing a sourdough starter, patiently waiting for the dough to rise, and finally baking a perfect loaf became a daily ritual that brought immense joy and satisfaction.",
    "col2-header": "A Commitment to Quality",
    "col2-desc":
      "At CottageShop, we believe that the best bread comes from the best ingredients. That's why we use only the finest, locally sourced flour and pure, filtered water in our sourdough. Our commitment to quality extends to every step of the baking process, from the careful cultivation of our sourdough starter to the meticulous hand-shaping of each loaf. We bake in small batches to ensure that every piece of bread receives the attention and care it deserves.",
    "col3-header": "The Art of Sourdough",
    "col3-desc":
      "Sourdough baking is more than just a technique; it's an art form that requires patience, precision, and a deep understanding of the ingredients. Our sourdough starter is a living entity, nurtured and fed daily to produce the perfect balance of tangy flavor and airy crumb. Each loaf is a labor of love, fermented slowly to develop complex flavors and baked to achieve a crust that's both crisp and chewy.",
    "col4-header": "Looking Ahead",
    "col4-desc":
      "As we continue our journey, we remain committed to our values of quality, tradition, and community. We are excited to share our passion for sourdough with more people, bringing the joy of freshly baked bread to tables across our community. At CottageShop, every loaf is a testament to our love for baking and our dedication to creating something truly special. Thank you for being a part of our story. We invite you to experience the magic of CottageShop and discover the joy of sourdough.",
    ...props.content,
  };

  return (
    <section>
      <Container maxWidth="lg">
        <Box py={8}>
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
          <Grid container spacing={6}>
            <Grid item xs={12} lg={4}>
              <Typography variant="h1" component="h2">
                {content["header"]}
              </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={12}>
                  <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="h4" component="h3" color="primary">
                      {content["col1-header"]}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="p">
                    {content["col1-desc"]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="h4" component="h3" color="primary">
                      {content["col2-header"]}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="p">
                    {content["col2-desc"]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="h4" component="h3" color="primary">
                      {content["col3-header"]}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="p">
                    {content["col3-desc"]}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box mb={2} display="flex" alignItems="center">
                    <Typography variant="h4" component="h3" color="primary">
                      {content["col4-header"]}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="p">
                    {content["col4-desc"]}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </section>
  );
}
