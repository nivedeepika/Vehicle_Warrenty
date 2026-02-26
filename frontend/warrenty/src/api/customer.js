// src/api/customer.js

const BASE_URL = "http://localhost:5000/api/auth";

export const getCustomerDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please login again.");
    }

    const response = await fetch(`${BASE_URL}/customer/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch customer dashboard");
    }

    return data;

  } catch (error) {
    console.error("Customer Dashboard Error:", error.message);
    throw error;
  }
};