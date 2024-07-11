import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper } from "@mui/material";
import axios from "axios";

const OrdersGrid = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "";
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // TODO: move to api service
        const response = await axios.get(`${apiUrl}/api/orders`, {
          withCredentials: true,
        });

        // Ensure each order has a unique id
        const ordersWithId = response.data.map((order) => {
          if (!order.id) {
            console.error("Missing id for order:", order);
          }
          return {
            ...order,
            id: order.id,
          };
        });

        setOrders(ordersWithId);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "items", headerName: "Items", width: 250 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "payment_type", headerName: "Payment Type", width: 150 },
    { field: "date_requested", headerName: "Date Requested", width: 150 },
    { field: "comments", headerName: "Comments", width: 250 },
    { field: "ordered_by", headerName: "Ordered By", width: 150 },
  ];

  return (
    <Paper
      style={{
        padding: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        marginTop: "72px",
      }}
      elevation={7}
    >
      <Box style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={10}
          loading={loading}
          getRowId={(row) => row.id} // Specify the id field
        />
      </Box>
    </Paper>
  );
};

export default OrdersGrid;
