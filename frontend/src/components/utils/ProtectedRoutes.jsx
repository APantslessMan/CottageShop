import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const apiUrl = process.env.REACT_APP_API_URL;

const ProtectedRoute = ({
  component: Component,
  adminComponent: AdminComponent,
}) => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // This is broken. TODO: Move to a SPA architecture where you use a short lived JWT
  // token to authenticate the user and then use the long lived refresh token to get a new JWT token
  useEffect(() => {
    const fetchRole = async () => {
      console.log("API URL:", apiUrl);
      const token = Cookies.get("access_token_cookie");
      console.log("Tokent:", token);
      const response = await fetch(`${apiUrl}/role`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      console.log("Response:", response);
      const data = await response.json();
      if (response.ok) {
        setRole(data.role);
        console.log("Role:", data.role);
      } else {
        console.error("Failed to get role:", data.message);
      }
    };
    fetchRole();
    const token = Cookies.get("access_token_cookie");
    console.log("Token:", token);

    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      setRole(decodedToken.role);
      console.log("Role:", role);
    }

    if (!token) {
      navigate("/login");
    } else {
      fetchRole();
    }
  }, [navigate]);

  if (role === "admin") {
    return <AdminComponent />;
  }

  return role ? <Component /> : null;
};

export default ProtectedRoute;
