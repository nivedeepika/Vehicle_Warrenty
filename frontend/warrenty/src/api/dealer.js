// src/api/dealer.js

const BASE_URL = "http://localhost:5000/api/auth";

/* ===============================
   DEALER LOGIN
================================= */
export const dealerLogin = async () => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "deal@gmail.com",      // static dealer email
        password: "dealer123",        // static dealer password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Dealer login failed");
    }

    // ✅ Store token & role
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", JSON.stringify(data));

    return data;

  } catch (error) {
    console.error("Dealer Login Error:", error.message);
    throw error;
  }
};


/* ===============================
   DEALER DASHBOARD (Protected)
================================= */
export const getDealerDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please login again.");
    }

    const response = await fetch(`${BASE_URL}/dealer/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch dashboard");
    }

    return data;

  } catch (error) {
    console.error("Dealer Dashboard Error:", error.message);
    throw error;
  }
};