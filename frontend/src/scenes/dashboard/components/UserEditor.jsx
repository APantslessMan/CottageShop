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
} from "@mui/material";
import axios from "axios";
import UserTools from "../utils/UserTools";
import authService from "../../../components/api/authService";
//TODO: move from using axios to the authservice component
const UserEditor = ({ showSb }) => {
  const [users, setUsers] = useState([]);
  const token = authService.refreshToken();
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/user`, {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await authService.editUser("del", id);
      const response = await axios.get(`${apiUrl}/api/user`, {
        withCredentials: true,
      });
      setUsers(response.data);

      showSb(`User Deleted`, "success");
    } catch (error) {
      showSb(`User Delete Failed: ${error}`, "error");
    }

    console.log(`Delete user with ID: ${id}`);
  };

  const handleUpdate = (id) => {
    // Implement the update user logic here
    console.log(`Update user with ID: ${id}`);
  };

  const handleResetPassword = async (id) => {
    try {
      await authService.editUser("res", id);
      const response = await axios.get(`${apiUrl}/api/user`, {
        withCredentials: true,
      });

      setUsers(response.data);
      showSb(`Password Reset`, "success");
    } catch (error) {
      showSb(`Password Reset Failed: ${error}`, "error");
    }
    console.log(`Password Reset to "Password": ${id}`);
  };

  const handleUpgradeRole = async (id) => {
    try {
      await authService.editUser("role_up", id);
      const response = await axios.get(`${apiUrl}/api/user`, {
        withCredentials: true,
      });

      setUsers(response.data);
      showSb(`User Upgraded`, "success");
    } catch (error) {
      showSb(`User Upgrade Failed: ${error}`, "error");
    }
  };

  const handleDowngradeRole = async (id) => {
    try {
      await authService.editUser("role_down", id);
      const response = await axios.get(`${apiUrl}/api/user`, {
        withCredentials: true,
      });

      setUsers(response.data);
      showSb(`User Downgrade`, "success");
    } catch (error) {
      showSb(`User Downgrade Failed: ${error}`, "error");
    }
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
              <TableCell style={{ fontWeight: "bold" }}>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>

                <TableCell>
                  {user.purchases ? user.purchases.length : "None"}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                {/* Need to add 4 icons, each icon to either delete user, update user, 
                reset password, upgrade user role and downgrade */}
                <UserTools
                  userid={user.id}
                  userrole={user.role}
                  handleDelete={handleDelete}
                  handleUpdate={handleUpdate}
                  handleResetPassword={handleResetPassword}
                  handleUpgradeRole={handleUpgradeRole}
                  handleDowngradeRole={handleDowngradeRole}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserEditor;
