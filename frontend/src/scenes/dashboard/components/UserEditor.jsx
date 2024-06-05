import React, { useEffect, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import UserTools from "../utils/UserTools";
import authService from "../../../components/api/authService";

//TODO: move from using axios to the authservice component
const UserEditor = ({ showSb }) => {
  const [users, setUsers] = useState([]);
  const [newValue, setNewValue] = useState("");
  authService.refreshToken();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "";

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
  const handleCellEdit = (id, columnName, newValue) => {
    setNewValue(newValue);
    console.log("handleCellEdit", id, columnName, newValue);
  };

  const handleUpdate = async (action, id, column, newField) => {
    try {
      // Perform the update operation
      console.log("handleUpdate1", action, id, column, newField);
      await authService.editUser(action, id, column, newField);
      console.log("handleUpdate", action, id, column, newField);
      // If the update is successful, fetch the updated user data
      const response = await axios.get(`${apiUrl}/api/user`, {
        withCredentials: true,
      });
      setUsers(response.data);

      // Show a success message
      showSb(`User Updated`, "success");
    } catch (error) {
      // Handle errors
      showSb(`User Update Failed: ${error}`, "error");
    }
  };
  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "name", headerName: "Name", width: 100 },
    {
      field: "email",
      headerName: "Email",
      width: 150,

      // valueGetter: (params) => params?.row?.email || "N/A",
    },
    {
      field: "purchases",
      headerName: "Purchases",
      width: 50,
      valueGetter: (params) =>
        params?.row?.purchases ? params.row.purchases.length : "None",
    },
    { field: "role", headerName: "Role", width: 70 },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <UserTools
          userid={params.row.id}
          userrole={params.row.role}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          handleResetPassword={handleResetPassword}
          handleUpgradeRole={handleUpgradeRole}
          handleDowngradeRole={handleDowngradeRole}
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
        marginTop: "72px",
      }}
      elevation={7}
    >
      <Box
        style={{
          width: "100%",
          // border: "2px solid white",
          // borderRadius: "15px",
          // overflow: "hidden",
          margin: "10px",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          align="left"
          // borderBottom="solid 2px white"
          p={2}
        >
          User Editor
        </Typography>
        <Box style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            onCellEditStop={(newValue, id, columnName) =>
              handleCellEdit(newValue, id, columnName)
            }
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default UserEditor;
