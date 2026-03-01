import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import "./Dealer.css";

const DealerDashboard = () => {
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

  return (
    <div className="dealer-container">
      <h2><FileText size={22} /> Dealer Dashboard</h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Issue</th>
              <th>Odometer</th>
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
                  No Pending Claims
                </td>
              </tr>
            ) : (
              claims.map((claim) => (
                <tr key={claim._id}>
                  <td>{claim.vehicle?.vehicleNumber}</td>
                  <td>{claim.user?.name}</td>
                  <td>{claim.issueTitle}</td>
                  <td>{claim.odometerReading}</td>
                  <td className="actions">
                    <button
                      className="approve"
                      onClick={() => updateStatus(claim._id, "approved")}
                    >
                      <CheckCircle size={18} /> Approve
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

export default DealerDashboard;