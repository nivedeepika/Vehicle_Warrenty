// src/api/admin.js

const BASE_URL = "http://localhost:5000/api/auth";

/* ===============================
   ADMIN LOGIN
================================= */
export const adminLogin = async () => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@gmail.com",   // static admin email
        password: "admin123",       // static admin password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Admin login failed");
    }

    // ✅ Store token & role
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", JSON.stringify(data));

    return data;

  } catch (error) {
    console.error("Admin Login Error:", error.message);
    throw error;
  }
};


/* ===============================
   ADMIN DASHBOARD (Protected)
================================= */
export const getAdminDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please login again.");
    }

    const response = await fetch(`${BASE_URL}/admin/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch admin dashboard");
    }

    return data;

  } catch (error) {
    console.error("Admin Dashboard Error:", error.message);
    throw error;
  }
};