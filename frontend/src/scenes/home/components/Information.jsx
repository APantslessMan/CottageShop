import React from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";

const Information = (props) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const modinfo = Object.keys(props)
    .map((key) => {
      if (props[key].header) {
        return {
          header: props[key].header,
          description: props[key].description,
          image: props[key].image,
        };
      }
      return null;
    })
    .filter(Boolean);
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ marginTop: "150px" }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Why Sourdough?
        </Typography>
        <Divider
          variant="middle"
          sx={{
            height: "2px",
            backgroundColor: "primary.main",
            margin: "40px 0",
          }}
        />
      </Box>
      {modinfo.map((info, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: isSmallScreen
              ? "column"
              : index % 2 === 0
              ? "row"
              : "row-reverse",
            mb: 6,
            alignItems: "center",
            minHeight: "296px",
          }}
        >
          <Paper
            component="img"
            src={info.image}
            alt={info.header}
            sx={{
              width: { xs: "100%", md: "50%" },
              height: "auto",
              objectFit: "cover",
              minHeight: "294px",
              marginBottom: isSmallScreen ? "-20px" : "0",
              marginRight: isSmallScreen || index % 2 !== 0 ? "0" : "-20px",
              marginLeft: isSmallScreen || index % 2 === 0 ? "0" : "-20px",
              zIndex: 1,
            }}
            elevation={10}
          />
          <Paper
            sx={{
              padding: 4,
              width: { xs: "100%", md: "50%" },
              textAlign: isSmallScreen
                ? "center"
                : index % 2 === 0
                ? "left"
                : "right",
              backgroundColor: "background.paper",
              minHeight: "294px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              zIndex: 0,
            }}
            elevation={10}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              {info.header}
            </Typography>
            <Typography variant="body1" component="p">
              {info.description}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Container>
  );
};

export default Information;
