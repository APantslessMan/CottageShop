import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";

const UserEditor = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    // Fetch user data from API
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user`, {
          withCredentials: true,
        }); // Replace with your API endpoint
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Paper
      style={{
        padding: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
      elevation={3}
    >
      <TableContainer
        style={{
          width: "80%", // Adjust width as needed
          border: "2px solid white", // Add border
          borderRadius: "15px", // Add border radius
          overflow: "hidden", // Hide overflow
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          borderBottom="solid 2px white"
          p={2}
        >
          User Editor
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Purchases</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Example user data */}
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>

                <TableCell>
                  {user.purchases ? user.purchases.length : "None"}
                </TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
            {/* Add more user data rows as needed */}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserEditor;
