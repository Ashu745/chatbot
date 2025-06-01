import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage

  // If no token is found, redirect to login
  if (!token) {
    return <Navigate to="/" />;
  }

  return children; // If token is found, allow access to the protected route
};

export default ProtectedRoute;
