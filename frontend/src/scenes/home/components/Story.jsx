import React from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Divider,
  Paper,
} from "@mui/material";
// import { makeStyles } from "@mui/core/styles";

export default function Story(props) {
  const content = {
    badge: "Our Story",
    header: "Our Story",
    ...props,
  };

  return (
    <section>
      <Container maxWidth="lg">
        <Box py={8}>
          <Box sx={{ marginTop: "100px" }}>
            <Typography variant="h1" component="h2">
              {content["header"]}
            </Typography>{" "}
            <Divider
              variant="middle"
              sx={{
                height: "2px",
                backgroundColor: "primary.main",
                margin: "16px 0",
              }}
            />
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12} lg={4}></Grid>
            <Grid item xs={12} lg={8}>
              <Paper elevation={10} sx={{ padding: 2 }}>
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
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </section>
  );
}
