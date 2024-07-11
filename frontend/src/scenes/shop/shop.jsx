import React, { useContext, useState } from "react";
import {
  Paper,
  Grid,
  Box,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import { DataContext } from "../../components/utils/DataContext";
import { Categories, DropCategories } from "./components/Categories";
import apiService from "../../components/api/apiService";
import ProductCard from "../home/components/ProductCard";
const Shop = () => {
  const theme = useTheme();
  const { siteData, productData, loading } = useContext(DataContext);
  const isXs = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [productList, setProductList] = useState([]);
  const categoryNames = Object.keys(siteData.categories);
  const selectedCategory = categoryNames[selectedIndex];
  const products = siteData.categories[selectedCategory] || [];

  if (loading || !productData) {
    return <div mt="75px">Loading...</div>;
  }
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        md={2}
        mb={-10}
        style={{
          padding: 2,

          marginTop: "80px",
          marginLeft: "10px",
          marginRight: "10px",
        }}
      >
        {isXs ? (
          <DropCategories
            categories={siteData["categories"]}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            theme={theme}
          />
        ) : (
          <Paper
            style={{
              padding: 2,
              minHeight: "80vh",
              marginLeft: "10px",
              marginRight: "10px",
            }}
            elevation={7}
          >
            <Categories
              categories={siteData["categories"]}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </Paper>
        )}
      </Grid>

      <Grid item xs={12} md={9} mt={10} ml={4}>
        <Typography variant="h4" mb={2}>
          {selectedCategory}
        </Typography>
        <Grid
          container
          sx={{
            justifyContent: { xs: "center", sm: "flex-start" },
            alignItems: { xs: "center", sm: "flex-start" },
          }}
        >
          {products.map((productId) => {
            const product = productData.find((p) => p.id === productId);
            if (!product) {
              return (
                <Grid item xs={12} key={productId}>
                  <Typography variant="body1" color="textSecondary">
                    Product not found
                  </Typography>
                </Grid>
              );
            }
            return (
              //   <Grid item xs={12} sm={6} md={4} key={productId}>
              <Grid item sm={6} md={4} lg={3} p={2} key={productId}>
                <Box>
                  <ProductCard product={product} />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Shop;
