import React, { useEffect, useState } from "react";
import axios from "axios";
import { Lock } from "lucide-react";
import "./StepCustomerVehicle.css";

const StepCustomerVehicle = ({
  customer,
  vehicle,
  onCustomerChange,
  onVehicleChange,
}) => {
  const [vehicles, setVehicles] = useState([]);

  // 🔥 Fetch vehicles of logged in user
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/vehicle/my",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setVehicles(res.data.data);
      } catch (error) {
        console.error("Failed to load vehicles", error);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="scv-container">
      <div className="scv-card">

        <h3 className="scv-title">Customer & Vehicle Details</h3>
        <p className="scv-subtitle">
          <Lock size={14} /> Some fields are auto-filled from your profile
        </p>

        {/* ================= CUSTOMER ================= */}
        <h4 className="scv-section-title">Customer Details</h4>

        <div className="scv-grid scv-two-col">
          <div className="scv-field">
            <label>Full Name</label>
            <input value={customer.fullName} readOnly className="scv-disabled" />
          </div>

          <div className="scv-field">
            <label>Email</label>
            <input value={customer.email} readOnly className="scv-disabled" />
          </div>

          <div className="scv-field">
            <label>Mobile Number</label>
            <input value={customer.mobile} readOnly className="scv-disabled" />
          </div>

          <div className="scv-field">
            <label>Address (Optional)</label>
            <input
              value={customer.address}
              onChange={(e) =>
                onCustomerChange({ address: e.target.value })
              }
              placeholder="Enter your address"
            />
          </div>
        </div>

        <div className="scv-divider"></div>

        {/* ================= VEHICLE ================= */}
        <h4 className="scv-section-title">Vehicle Details</h4>

        <div className="scv-grid scv-two-col">

          {/* 🔥 VEHICLE DROPDOWN FROM DATABASE */}
          <div className="scv-field">
            <label>Select Your Vehicle</label>
            <select
              value={vehicle.vehicleId || ""}
              onChange={(e) => {
                const selectedVehicle = vehicles.find(
                  (v) => v._id === e.target.value
                );

                if (!selectedVehicle) return;

                onVehicleChange({
                  vehicleId: selectedVehicle._id,
                  model: selectedVehicle.model || "",
                  vehicleNumber: selectedVehicle.vehicleNumber || "",

                  purchaseDate: selectedVehicle.purchaseDate || "",

                });
              }}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.model} - {v.vehicleNumber}
                </option>
              ))}
            </select>

          </div>
          {vehicle.vehicleId && (
            <>
              <div className="scv-field">
                <label>Model</label>
                <input value={vehicle.model} readOnly className="scv-disabled" />
              </div>

              <div className="scv-field">
                <label>Vehicle Number</label>
                <input value={vehicle.vehicleNumber} readOnly className="scv-disabled" />
              </div>

              <div className="scv-field">
                <label>Purchase Date</label>
                <input
                  type="date"
                  value={vehicle.purchaseDate?.substring(0, 10)}
                  readOnly
                  className="scv-disabled"
                />
              </div>

              {/* ✅ Editable VIN */}
              <div className="scv-field">
                <label>VIN Number</label>
                <input
                  value={vehicle.vinNumber || ""}
                  onChange={(e) =>
                    onVehicleChange({ vinNumber: e.target.value })
                  }
                  placeholder="Enter VIN Number"
                />
              </div>

              {/* ✅ Editable Dealer Name */}
              <div className="scv-field">
                <label>Dealer Name</label>
                <input
                  value={vehicle.dealerName || ""}
                  onChange={(e) =>
                    onVehicleChange({ dealerName: e.target.value })
                  }
                  placeholder="Enter Dealer Name"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepCustomerVehicle;