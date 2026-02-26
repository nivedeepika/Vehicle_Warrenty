import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Tag, Modal, Spin } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import MainLayout from "../Layout/Layout";
import "./Customer.css";

const Customer = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRequests([
        {
          id: "12345678",
          status: "approved",
          model: "Honda City",
          vehicle_number: "TN09AB1234",
          issue_description: "Engine overheating issue",
          invoice_number: "INV-001",
          invoice_date: "2024-01-10",
          purchase_amount: 1500,
        },
        {
          id: "87654321",
          status: "pending",
          model: "Hyundai i20",
          vehicle_number: "TN10XY5678",
          issue_description: "Battery problem",
          invoice_number: "INV-002",
          invoice_date: "2024-02-05",
          purchase_amount: 900,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusTag = (status) => {
    switch (status) {
      case "approved":
        return <Tag color="green" icon={<CheckCircleOutlined />}>Approved</Tag>;
      case "rejected":
        return <Tag color="red" icon={<CloseCircleOutlined />}>Rejected</Tag>;
      case "pending":
        return <Tag color="orange" icon={<ClockCircleOutlined />}>Pending</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <MainLayout>
      <div className="dashboard-header">
        <h2>My Warranty Requests</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowModal(true)}
        >
          New Request
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} className="stats-row">
        <Col xs={24} md={8}>
          <Card className="stat-card">
            <FileTextOutlined className="stat-icon blue" />
            <h3>{requests.length}</h3>
            <p>Total Requests</p>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="stat-card">
            <CheckCircleOutlined className="stat-icon green" />
            <h3>
              {requests.filter((r) => r.status === "approved").length}
            </h3>
            <p>Approved</p>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="stat-card">
            <ClockCircleOutlined className="stat-icon orange" />
            <h3>
              {requests.filter((r) => r.status === "pending").length}
            </h3>
            <p>Pending</p>
          </Card>
        </Col>
      </Row>

      {/* Requests List */}
      {loading ? (
        <div className="loader">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {requests.map((request) => (
            <Col xs={24} md={12} key={request.id}>
              <Card className="request-card">
                <div className="card-header">
                  {getStatusTag(request.status)}
                  <span className="request-id">
                    Request #{request.id}
                  </span>
                </div>

                <div className="card-body">
                  <p><strong>Model:</strong> {request.model}</p>
                  <p><strong>Vehicle No:</strong> {request.vehicle_number}</p>
                  <p><strong>Issue:</strong> {request.issue_description}</p>
                  <p><strong>Invoice:</strong> {request.invoice_number}</p>
                  <p><strong>Date:</strong> {request.invoice_date}</p>
                  <p><strong>Amount:</strong> ₹{request.purchase_amount}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Create New Warranty Request"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <p>Warranty Form will come here...</p>
      </Modal>
    </MainLayout>
  );
};

export default Customer;