import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import authService from "../api/authService";

const ProtectedRoute = ({
  component: Component,
  adminComponent: AdminComponent,
}) => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await authService.getRole();
        setRole(role);
      } catch (error) {
        console.error("Failed to get role:", error.message);
        navigate("/login");
      }
    };

    fetchRole();
  }, [navigate]);

  if (role === "admin") {
    return <AdminComponent />;
  }

  return role ? <Component /> : null;
};

export default ProtectedRoute;
