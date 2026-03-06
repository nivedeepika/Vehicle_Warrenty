import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, ShieldCheck, Home, History } from "lucide-react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const totalClaims = claims.length;
  const pendingClaims = claims.filter(c => c.status === "dealerApproved").length;
  const approvedClaims = claims.filter(c => c.status === "approved").length;
  const rejectedClaims = claims.filter(c => c.status === "rejected").length;
  const navigate = useNavigate();

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
        { status },
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

  /* Filter data */
  const filteredClaims =
    activeTab === "home"
      ? claims.filter((c) => c.status === "dealerApproved")
      : claims.filter((c) => c.status === "approved" || c.status === "rejected");

  return (
    <div className="admin-container">
      <h2>
        <ShieldCheck size={22} /> Admin Dashboard
      </h2>

      {/* Analytics Section */}
      <div className="analytics">
        <div className="analytics-card total">
          <h3>{totalClaims}</h3>
          <p>Total Claims</p>
        </div>

        <div className="analytics-card pending">
          <h3>{pendingClaims}</h3>
          <p>Pending</p>
        </div>

        <div className="analytics-card approved">
          <h3>{approvedClaims}</h3>
          <p>Approved</p>
        </div>

        <div className="analytics-card rejected">
          <h3>{rejectedClaims}</h3>
          <p>Rejected</p>
        </div>
      </div>

      {/* Navbar */}
      <div className="admin-navbar">
        <button
          onClick={() => navigate("/admin/")}
        >
          <Home size={18} /> Home
        </button>

        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          <History size={18} /> History
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Issue</th>
              <th>Status</th>
              {activeTab === "home" && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="no-data">
                  Loading...
                </td>
              </tr>
            ) : filteredClaims.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No Records
                </td>
              </tr>
            ) : (
              filteredClaims.map((claim) => (
                <tr key={claim._id}>
                  <td>{claim.vehicle?.vehicleNumber}</td>
                  <td>{claim.user?.name}</td>
                  <td>{claim.issueTitle}</td>
                  <td>{formatStatus(claim.status)}</td>

                  {activeTab === "home" && (
                    <td className="actions">
                      <button
                        className="approve"
                        onClick={() =>
                          updateStatus(claim._id, "approved")
                        }
                      >
                        <CheckCircle size={18} /> Final Approve
                      </button>

                      <button
                        className="reject"
                        onClick={() =>
                          updateStatus(claim._id, "rejected")
                        }
                      >
                        <XCircle size={18} /> Reject
                      </button>
                    </td>
                  )}
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