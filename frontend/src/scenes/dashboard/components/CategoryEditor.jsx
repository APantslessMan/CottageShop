import React, { useState, useEffect, useContext } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import apiService from "../../../components/api/apiService";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataContext } from "../../../components/utils/DataContext";

const CategoryEditor = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    if (siteData.categories) {
      // Transform the categories data into an array format expected by the component
      const transformedCategories = Object.keys(siteData.categories).map(
        (categoryName) => ({
          id: categoryName,
          name: categoryName,
          products: siteData.categories[categoryName],
        })
      );
      setCategories(transformedCategories);
    }
  }, [siteData]);

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return;

    const newCategory = {
      id: newCategoryName,
      name: newCategoryName,
      products: [],
    };
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
  };

  const handleRemoveCategory = (categoryName) => {
    setCategories(
      categories.filter((category) => category.name !== categoryName)
    );
  };

  const handleAddProductToCategory = (productId, categoryId) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return { ...category, products: [...category.products, productId] };
        }
        return category;
      })
    );
  };

  const handleRemoveProductFromCategory = (productId, categoryId) => {
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            products: category.products.filter((id) => id !== productId),
          };
        }
        return category;
      })
    );
  };

  const handleSubmit = async () => {
    const data = {
      categories: categories.reduce((acc, category) => {
        acc[category.name] = category.products;
        return acc;
      }, {}),
    };
    try {
      const response = await apiService.editcategory(data);
      if (response.status === 201) {
        alert("Categories updated successfully!");
        fetchData();
      } else {
        alert("Failed to update categories.");
      }
    } catch (error) {
      console.error("Error submitting categories:", error);
      alert("Error submitting categories.");
    }
  };

  const handleMenuOpen = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleMenuItemClick = (categoryId) => {
    if (selectedProduct) {
      handleAddProductToCategory(selectedProduct.id, categoryId);
    }
    handleMenuClose();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignContent="center"
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 1,
        m: 1,
        bgcolor: "background.paper",
        borderRadius: 1,
      }}
      p={2}
    >
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={3} sx={{ marginLeft: "20px" }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{ marginBottom: "10px" }}
          >
            <TextField
              label="New Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              InputProps={{
                style: {
                  marginBottom: "20px",
                },
              }}
            />
            <Button
              onClick={handleAddCategory}
              variant="contained"
              color="primary"
              style={{
                marginTop: "-20px",
                marginLeft: "10px",
                textAlign: "center",
                height: "50px",
              }}
            >
              Add Category
            </Button>
          </Box>
          {categories.length > 0 ? (
            categories.map((category) => (
              <Accordion key={category.id} elevation={10}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  {category.name}
                  <IconButton
                    onClick={() => handleRemoveCategory(category.name)}
                    style={{ marginLeft: "auto" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </AccordionSummary>
                <AccordionDetails>
                  <Divider
                    sx={{
                      height: "2px",
                      backgroundColor: "primary.main",
                      margin: "-20px, 0",
                    }}
                  />
                  <List>
                    {category.products.map((productId) => {
                      const product = products.find((p) => p.id === productId);
                      return product ? (
                        <ListItem key={product.id}>
                          <ListItemText primary={product.name} />
                          <IconButton
                            onClick={() =>
                              handleRemoveProductFromCategory(
                                product.id,
                                category.id
                              )
                            }
                          >
                            <RemoveIcon />
                          </IconButton>
                        </ListItem>
                      ) : null;
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="h6">No categories available</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography variant="h6">Available Products</Typography>
          <List>
            {products
              .filter(
                (product) =>
                  !categories.some((cat) => cat.products.includes(product.id))
              )
              .map((product) => (
                <ListItem key={product.id}>
                  <ListItemText primary={product.name} />
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, product)}
                  >
                    <AddIcon />
                  </IconButton>
                </ListItem>
              ))}
          </List>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
            style={{ marginTop: "20px" }}
          >
            Submit Changes
          </Button>
        </Grid>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {categories.map((category) => (
            <MenuItem
              key={category.id}
              onClick={() => handleMenuItemClick(category.id)}
            >
              {category.name}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
    </Box>
  );
};

export default CategoryEditor;
