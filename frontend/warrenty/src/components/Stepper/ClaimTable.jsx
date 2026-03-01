import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message, Spin } from "antd";
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Car,
} from "lucide-react";
import axios from "axios";
import "./ClaimTable.css";

const ClaimsTable = () => {
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
      message.error("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED STATUS TAG
  const getStatusTag = (status) => {
    const normalized = status?.toLowerCase();

    switch (normalized) {
      case "approved":
        return (
          <Tag color="green" icon={<CheckCircle size={14} />}>
            Approved
          </Tag>
        );

      case "rejected":
        return (
          <Tag color="red" icon={<XCircle size={14} />}>
            Rejected
          </Tag>
        );

      default:
        return (
          <Tag color="orange" icon={<Clock size={14} />}>
            Pending
          </Tag>
        );
    }
  };

  const handleDownload = (claimId) => {
    window.open(
      `http://localhost:5000/api/warranty/download/${claimId}`,
      "_blank"
    );
  };

  const columns = [
    {
      title: "Vehicle",
      dataIndex: ["vehicle", "vehicleNumber"],
      render: (text) => (
        <div className="ct-vehicle">
          <Car size={16} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Model",
      dataIndex: ["vehicle", "model"],
    },
    {
      title: "Issue",
      dataIndex: "issueTitle",
      render: (text) => (
        <div className="ct-issue">
          <FileText size={14} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Download",
      render: (_, record) => {
        const isApproved =
          record.status?.toLowerCase() === "approved";

        return (
          <Button
            type="primary"
            icon={<Download size={14} />}
            disabled={!isApproved}
            className="ct-download-btn"
            onClick={() => handleDownload(record.claimId)}
          >
            Download
          </Button>
        );
      },
    },
  ];

  return (
    <div className="claims-table-wrapper">
      <h2 className="claims-title">My Warranty Claims</h2>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={claims}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
          className="claims-table"
        />
      </Spin>
    </div>
  );
};

export default ClaimsTable;