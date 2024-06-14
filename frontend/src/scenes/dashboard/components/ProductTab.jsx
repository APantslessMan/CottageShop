import React, { useState, useEffect, useContext } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container, Box } from "@mui/material";
import apiService from "../../../components/api/apiService";
import { DataContext } from "../../../components/utils/DataContext";

const ProductTab = () => {
  const [homeProducts, setHomeProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const { siteData, fetchData } = useContext(DataContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.listProducts();
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (siteData && siteData["home_products"]) {
      setHomeProducts(siteData["home_products"]);
    }
  }, [siteData]);

  const updateHomeProductsApi = async (updatedHomeProducts) => {
    try {
      const formData = new FormData();
      formData.append("op", "home_products");
      formData.append("products", JSON.stringify(updatedHomeProducts));
      await apiService.editsite(formData);
      console.log("Home products updated successfully");
      fetchData(); // Optionally refresh site data if needed
    } catch (error) {
      console.error("Error updating home products:", error);
    }
  };

  const addToHomeProducts = (product) => {
    if (!homeProducts.some((p) => p.id === product.id)) {
      const updatedHomeProducts = [...homeProducts, product];
      setHomeProducts(updatedHomeProducts);
      updateHomeProductsApi(updatedHomeProducts);
    }
  };

  const removeFromHomeProducts = (product) => {
    const updatedHomeProducts = homeProducts.filter((p) => p.id !== product.id);
    setHomeProducts(updatedHomeProducts);
    updateHomeProductsApi(updatedHomeProducts);
  };

  const isProductInHome = (productId) => {
    return homeProducts.some((p) => p.id === productId);
  };

  return (
    <Container>
      <Box mt={4}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={5}>
            <Typography variant="h6">All Products</Typography>
            <List>
              {products.map((product) => (
                <ListItem
                  key={product.id}
                  secondaryAction={
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addToHomeProducts(product)}
                      disabled={isProductInHome(product.id)}
                    >
                      Add
                    </Button>
                  }
                >
                  <ListItemText primary={product.name} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography variant="h6">Home Page Products</Typography>
            <List>
              {homeProducts.map((product) => (
                <ListItem
                  key={product.id}
                  secondaryAction={
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => removeFromHomeProducts(product)}
                    >
                      Remove
                    </Button>
                  }
                >
                  <ListItemText primary={product.name} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductTab;
