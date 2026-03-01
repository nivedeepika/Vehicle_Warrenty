import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "../Home/Navbar";
import "./AddVehicle.css";

const AddVehicle = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    vehicleNumber: "",
    model: "",
    purchaseDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.vehicleNumber || !form.model || !form.purchaseDate) {
      message.error("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/vehicle/add",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      message.success("Vehicle added successfully 🚗");
      console.log("backend data",res)
      // Go back to warranty page
      setTimeout(() => {
        navigate("/warranty");
      }, 1500);

    } catch (error) {
      console.error(error);
      message.error(
        error.response?.data?.message || "Failed to add vehicle"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="add-vehicle-container">
        <div className="add-vehicle-card">
          <h2>Add Vehicle</h2>

          <form onSubmit={handleSubmit}>
            <div className="av-field">
              <label>Vehicle Number *</label>
              <input
                type="text"
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={handleChange}
                placeholder="TN10AB1234"
                required
              />
            </div>

            <div className="av-field">
              <label>Model *</label>
              <input
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Sedan X1"
                required
              />
            </div>

            <div className="av-field">
              <label>Purchase Date *</label>
              <input
                type="date"
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="av-submit-btn">
              Save Vehicle
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddVehicle;