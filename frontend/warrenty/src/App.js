import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import AdminDashboard from "./components/Admin/AdminDashboard";
import DealerDashboard from "./components/Dealer/Dealer";
import CustomerDashboard from "./components/Customer/Customer";
import "antd/dist/reset.css";
function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route - Login Page */}
        <Route path="/" element={<Login />} />

        {/* Register Route */}
        <Route path="/register" element={<Register />} />

        {/* Redirect any unknown route to Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dealer" element={<DealerDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;