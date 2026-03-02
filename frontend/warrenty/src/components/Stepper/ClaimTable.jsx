import React, { useEffect, useState } from "react";
import { Table, Tag, message, Spin, Modal, Descriptions } from "antd";
import { generateWarrantyPDF } from "../../utils/generateWarrantyPDF";
import Navbar from "../Home/Navbar";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Car,
  Eye,
} from "lucide-react";
import axios from "axios";
import "./ClaimTable.css";

const ClaimsTable = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      message.error("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    const normalized = status?.toLowerCase();

    switch (normalized) {
      case "approved":
        return <Tag color="green">Approved</Tag>;
      case "rejected":
        return <Tag color="red">Rejected</Tag>;
      default:
        return <Tag color="orange">Pending</Tag>;
    }
  };

  const handleDownload = (claim) => {
    generateWarrantyPDF(claim);
  };

  const handlePreview = (claim) => {
    setSelectedClaim(claim);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Vehicle",
      dataIndex: ["vehicle", "vehicleNumber"],
      render: (text) => (
        <div className="ct-flex">
          <Car size={16} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Model",
      dataIndex: ["vehicle", "model"],
      align: "center",
    },
    {
      title: "Issue",
      dataIndex: "issueTitle",
      render: (text) => (
        <div className="ct-flex">
          <FileText size={14} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => {
        const isApproved =
          record.status?.toLowerCase() === "approved";

        return (
          <div className="ct-actions">
            <Eye
              size={18}
              className="ct-icon preview"
              onClick={() => handlePreview(record)}
            />

            <Download
              size={18}
              className={`ct-icon download ${
                !isApproved ? "disabled" : ""
              }`}
              onClick={() =>
                isApproved && handleDownload(record)
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="claims-page">
      <Navbar />

      <div className="claims-content">
        <h2 className="claims-title">My Warranty Claims</h2>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={claims}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            bordered
            className="claims-table"
          />
        </Spin>
      </div>

      {/* ===== MODAL ===== */}
      <Modal
        title="Warranty Claim Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={750}
      >
        {selectedClaim && (
          <Descriptions
            bordered
            column={1}
            size="small"
          >
            <Descriptions.Item label="Claim ID">
              {selectedClaim.claimId}
            </Descriptions.Item>

            <Descriptions.Item label="Status">
              {getStatusTag(selectedClaim.status)}
            </Descriptions.Item>

            <Descriptions.Item label="Customer Name">
              {selectedClaim.user?.name}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {selectedClaim.user?.email}
            </Descriptions.Item>

            <Descriptions.Item label="Vehicle Number">
              {selectedClaim.vehicle?.vehicleNumber}
            </Descriptions.Item>

            <Descriptions.Item label="Model">
              {selectedClaim.vehicle?.model}
            </Descriptions.Item>

            <Descriptions.Item label="Issue Category">
              {selectedClaim.issueCategory}
            </Descriptions.Item>

            <Descriptions.Item label="Issue Title">
              {selectedClaim.issueTitle}
            </Descriptions.Item>

            <Descriptions.Item label="Description">
              {selectedClaim.issueDescription}
            </Descriptions.Item>

            <Descriptions.Item label="Odometer">
              {selectedClaim.odometerReading}
            </Descriptions.Item>

            <Descriptions.Item label="Under Warranty">
              {selectedClaim.underWarranty ? "Yes" : "No"}
            </Descriptions.Item>

            <Descriptions.Item label="Created At">
              {new Date(
                selectedClaim.createdAt
              ).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ClaimsTable;