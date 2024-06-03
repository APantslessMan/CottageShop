import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
// import axios from "axios";
import apiService from "../../../components/api/apiService";
import ProductEditCell from "../utils/ProductEditCell";

const ShowProduct = ({ showSb }) => {
  const [products, setProducts] = useState([{}]);

  // const apiUrl = process.env.REACT_APP_API_URL;
  //   const apiUrl = process.env.VERCEL_URL; // For vercel deployment

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.listProducts();
        console.log("response", response);
        setProducts(response);
        // showSb(`Products Fetched`, "success");
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    console.log(`Delete Product with ID: ${id}`);

    try {
      apiService.editProduct("del", id).then((response) => {
        apiService.listProducts().then((response) => {
          console.log("response", response);
          setProducts(response);
          console.log(products);
          showSb(`Product Deleted`, "success");
        });
      });
    } catch (error) {
      showSb(`Product Delete Failed: ${error}`, "error");
    }

    console.log(`Delete Product with ID: ${id}`);
  }; //

  const handleUpdate = (id) => {
    // Implement the update Product logic here
    console.log(`Update Product with ID: ${id}`);
  };

  return (
    <Paper
      style={{
        padding: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
      elevation={7}
    >
      <TableContainer
        style={{
          width: "80%",
          border: "2px solid white",
          borderRadius: "15px",
          overflow: "hidden",
          margin: "40px",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          borderBottom="solid 2px white"
          p={2}
        >
          Product Editor
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Image</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description || "N/A"}</TableCell>

                <TableCell>{product.price}</TableCell>
                <TableCell>
                  {product.img_url ? (
                    <img src={product.img_url} alt="Product 1" width="50" />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <ProductEditCell
                  productId={product.id}
                  onDelete={() => handleDelete(product.id)}
                  onUpdate={() => handleUpdate(product.id)}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ShowProduct;
