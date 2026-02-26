import React from "react";
import { Card, Avatar, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import MainLayout from "../components/MainLayout";

const Profile = () => {
  // Replace with real user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    role: "Customer",
  };

  return (
    <MainLayout>
      <Row justify="center">
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: "10px" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Avatar size={80} icon={<UserOutlined />} />
              <h2 style={{ marginTop: 15 }}>{user.name}</h2>
            </div>

            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Profile;