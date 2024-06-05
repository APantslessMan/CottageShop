import React, { useState, useEffect } from "react";
import { Paper, Typography, Button } from "@mui/material";
import apiService from "../../../components/api/apiService";
import ProductEditCell from "../utils/ProductEditCell";
import { DataGrid } from "@mui/x-data-grid";

const ShowProduct = ({ showSb }) => {
  const [products, setProducts] = useState([]);

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

  const handleDelete = async (id) => {
    try {
      await apiService.editProduct("del", id);
      const updatedProducts = await apiService.listProducts();
      setProducts(updatedProducts);
      showSb(`Product Deleted`, "success");
    } catch (error) {
      showSb(`Product Delete Failed: ${error}`, "error");
    }
  };

  const handleUpdate = (id) => {
    console.log(`Update Product with ID: ${id}`);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "name", headerName: "Name", width: 100 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "price", headerName: "Price", width: 70 },
    {
      field: "img_url",
      headerName: "Image",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <img
            src={params.value}
            alt="Product"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        ) : (
          "N/A"
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <ProductEditCell
          productId={params.row.id}
          onDelete={() => handleDelete(params.row.id)}
          onUpdate={() => handleUpdate(params.row.id)}
        />
      ),
    },
  ];

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
      <div style={{ width: "100%", height: 400 }}>
        <Typography variant="h5" gutterBottom align="left" p={2}>
          Product Editor
        </Typography>
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
      </div>
    </Paper>
  );
};

export default ShowProduct;
