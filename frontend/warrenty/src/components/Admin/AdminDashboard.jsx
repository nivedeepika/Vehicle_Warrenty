import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  ShieldCheck,
  Home,
  History,
  FileText,
  Eye
} from "lucide-react";
import { Modal } from "antd";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const totalClaims = claims.length;
  const pendingClaims = claims.filter(c => c.status === "dealerApproved").length;
  const approvedClaims = claims.filter(c => c.status === "approved").length;
  const rejectedClaims = claims.filter(c => c.status === "rejected").length;

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
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
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
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
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

  const openPreview = (claim) => {
    setSelectedClaim(claim);
    setIsModalOpen(true);
  };

  const filteredClaims =
    activeTab === "home"
      ? claims.filter(c => c.status === "dealerApproved")
      : claims.filter(c => c.status === "approved" || c.status === "rejected");

  return (
    <div className="admin-container">

      <h2>
        <ShieldCheck size={22}/> Admin Dashboard
      </h2>

      {/* Analytics */}

      <div className="analytics">

        <div className="analytics-card total">
          <div>
            <h3>{totalClaims}</h3>
            <p>Total Claims</p>
          </div>
          <FileText size={40}/>
        </div>

        <div className="analytics-card pending">
          <div>
            <h3>{pendingClaims}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="analytics-card approved">
          <div>
            <h3>{approvedClaims}</h3>
            <p>Approved</p>
          </div>
        </div>

        <div className="analytics-card rejected">
          <div>
            <h3>{rejectedClaims}</h3>
            <p>Rejected</p>
          </div>
        </div>

      </div>

      {/* Navbar */}

      <div className="admin-navbar">

        <button onClick={() => navigate("/admin/")}>
          <Home size={18}/> Home
        </button>

        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          <History size={18}/> History
        </button>

      </div>

      {/* Table */}

      <div className="table-wrapper">

        <table>

          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Preview</th>
              {activeTab === "home" && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="6" className="no-data">Loading...</td>
              </tr>

            ) : filteredClaims.length === 0 ? (

              <tr>
                <td colSpan="6" className="no-data">No Records</td>
              </tr>

            ) : (

              filteredClaims.map((claim) => (

                <tr key={claim._id}>

                  <td>{claim.vehicle?.vehicleNumber}</td>
                  <td>{claim.user?.name}</td>
                  <td>{claim.issueTitle}</td>
                  <td>{formatStatus(claim.status)}</td>

                  {/* Preview */}

                  <td>
                    <button
                      className="preview-btn"
                      onClick={() => openPreview(claim)}
                    >
                      <Eye size={16}/> View
                    </button>
                  </td>

                  {activeTab === "home" && (

                    <td className="actions">

                      <button
                        className="approve"
                        onClick={() => updateStatus(claim._id,"approved")}
                      >
                        <CheckCircle size={16}/> Approve
                      </button>

                      <button
                        className="reject"
                        onClick={() => updateStatus(claim._id,"rejected")}
                      >
                        <XCircle size={16}/> Reject
                      </button>

                    </td>

                  )}

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* PREVIEW MODAL */}

      <Modal
        title="Claim Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >

        {selectedClaim && (

          <div className="preview-content">

            <h3>Customer Details</h3>
            <p><b>Name:</b> {selectedClaim.user?.name}</p>
            <p><b>Email:</b> {selectedClaim.user?.email}</p>

            <h3>Vehicle Details</h3>
            <p><b>Vehicle:</b> {selectedClaim.vehicle?.vehicleNumber}</p>
            <p><b>Model:</b> {selectedClaim.vehicle?.model}</p>

            <p><b>Warranty:</b> {selectedClaim.underWarranty ? "YES" : "NO"}</p>

            <h3>Issue Details</h3>
            <p><b>Category:</b> {selectedClaim.issueCategory}</p>
            <p><b>Title:</b> {selectedClaim.issueTitle}</p>
            <p><b>Description:</b> {selectedClaim.issueDescription}</p>

            <p><b>Odometer:</b> {selectedClaim.odometerReading}</p>

            <h3>Uploaded Files</h3>

            {selectedClaim.vehicleInvoice && (
              <a
                href={`http://localhost:5000/${selectedClaim.vehicleInvoice}`}
                target="_blank"
                rel="noreferrer"
              >
                View Invoice
              </a>
            )}

            <div className="preview-images">

              {selectedClaim.problemPhotos?.map((photo,index)=>(
                <img
                  key={index}
                  src={`http://localhost:5000/${photo}`}
                  alt="problem"
                  className="preview-image"
                />
              ))}

            </div>

            {selectedClaim.problemVideo && (
              <video
                controls
                width="100%"
                src={`http://localhost:5000/${selectedClaim.problemVideo}`}
              />
            )}

          </div>

        )}

      </Modal>

    </div>
  );
};

export default AdminDashboard;