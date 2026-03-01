import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/warranty/get-warranties",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setClaims(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/warranty/update-status/${id}`,
        { status }, // ✅ lowercase
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchClaims();
    } catch (err) {
      console.log(err);
    }
  };

  const formatStatus = (status) => {
    if (status === "dealerApproved") return "Dealer Approved";
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return status;
  };

  return (
    <div className="admin-container">
      <h2><ShieldCheck size={22} /> Admin Dashboard</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="no-data">Loading...</td>
              </tr>
            ) : claims.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No Dealer Approved Claims
                </td>
              </tr>
            ) : (
              claims.map((claim) => (
                <tr key={claim._id}>
                  <td>{claim.vehicle?.vehicleNumber}</td>
                  <td>{claim.user?.name}</td>
                  <td>{claim.issueTitle}</td>
                  <td>{formatStatus(claim.status)}</td>
                  <td className="actions">
                    <button
                      className="approve"
                      onClick={() => updateStatus(claim._id, "approved")}
                    >
                      <CheckCircle size={18} /> Final Approve
                    </button>
                    <button
                      className="reject"
                      onClick={() => updateStatus(claim._id, "rejected")}
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;