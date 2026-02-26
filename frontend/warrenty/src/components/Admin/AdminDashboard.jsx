// src/pages/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../../api/admin";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getAdminDashboard();
        setMessage(data.message || data);
      } catch (error) {
        console.error(error.message);

        // Auto logout if token invalid
        localStorage.clear();
        navigate("/");
      }
    };

    fetchDashboard();
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard 👑</h1>
      <h3>Welcome {user?.name}</h3>
      <p>Role: {user?.role}</p>

      <h4>{message}</h4>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;