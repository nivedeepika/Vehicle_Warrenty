// src/pages/DealerDashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDealerDashboard } from "../../api/dealer";

const DealerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDealerDashboard();
        setMessage(data.message || data);
      } catch (error) {
        console.error(error.message);

        // If token invalid → logout automatically
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
      <h1>Dealer Dashboard 🚗</h1>
      <h3>Welcome {user?.name}</h3>
      <p>Role: {user?.role}</p>

      <h4>{message}</h4>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default DealerDashboard;