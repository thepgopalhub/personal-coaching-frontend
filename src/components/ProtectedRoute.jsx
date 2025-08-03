import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = storedUser?.token;

  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
