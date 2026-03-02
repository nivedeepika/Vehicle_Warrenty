import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Modal,
  Divider,
  Spin,
  Row,
  Col,
} from "antd";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Trash2,
  Edit3,
  X,
} from "lucide-react";
import axios from "axios";
import Navbar from "../Home/Navbar";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [passwordEditMode, setPasswordEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      form.setFieldsValue(res.data);
    } catch {
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:5000/api/user/profile",
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success(res.data.message);
      setEditMode(false);
    } catch (err) {
      message.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      setPasswordLoading(true);
      const res = await axios.put(
        "http://localhost:5000/api/user/profile/change-password",
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success(res.data.message);
      passwordForm.resetFields();
      setPasswordEditMode(false);
    } catch (err) {
      message.error(err.response?.data?.message || "Password failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: "Delete Account?",
      content: "This action cannot be undone.",
      okType: "danger",
      onOk: async () => {
        await axios.delete(
          "http://localhost:5000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        localStorage.clear();
        window.location.href = "/";
      },
    });
  };

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        <Spin spinning={loading}>
          <Card className="profile-card">
            {/* ================= PROFILE ================= */}
            <div className="section-header">
              <div className="section-title">
                <User size={20} />
                <h2>Profile Information</h2>
              </div>

              {!editMode ? (
                <Button onClick={() => setEditMode(true)} icon={<Edit3 size={16} />}>
                  Edit
                </Button>
              ) : (
                <Button
                  icon={<X size={16} />}
                  onClick={() => {
                    setEditMode(false);
                    fetchProfile();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item name="name" label="Full Name">
                    <Input
                      prefix={<User size={16} />}
                      disabled={!editMode}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="email" label="Email">
                    <Input
                      prefix={<Mail size={16} />}
                      disabled={!editMode}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="mobile" label="Mobile">
                    <Input
                      prefix={<Phone size={16} />}
                      disabled={!editMode}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {editMode && (
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<Save size={16} />}
                  loading={loading}
                  className="profile-btn"
                >
                  Save Changes
                </Button>
              )}
            </Form>

            <Divider />

            {/* ================= PASSWORD ================= */}
            <div className="section-header">
              <div className="section-title">
                <Lock size={20} />
                <h2>Password</h2>
              </div>

              {!passwordEditMode ? (
                <Button onClick={() => setPasswordEditMode(true)}>
                  Change
                </Button>
              ) : (
                <Button
                  icon={<X size={16} />}
                  onClick={() => {
                    setPasswordEditMode(false);
                    passwordForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>

            {passwordEditMode && (
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handleChangePassword}
              >
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="currentPassword"
                      label="Current Password"
                      rules={[{ required: true }]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="newPassword"
                      label="New Password"
                      rules={[{ required: true, min: 6 }]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={passwordLoading}
                  className="profile-btn"
                >
                  Update Password
                </Button>
              </Form>
            )}

            <Divider />

            <Button
              danger
              icon={<Trash2 size={16} />}
              onClick={handleDeleteAccount}
              loading={deleteLoading}
              className="delete-btn"
            >
              Delete Account
            </Button>
          </Card>
        </Spin>
      </div>
    </div>
  );
};

export default ProfilePage;