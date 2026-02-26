import React from "react";
import { Layout, Dropdown, Avatar, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();

  // 🔥 Replace with real logged-in user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
  };

  const handleLogout = () => {
    // Clear token / localStorage here if needed
    localStorage.removeItem("token");

    // Redirect to login
    navigate("/login");
  };

  const menuItems = [
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "name",
      label: <span style={{ fontWeight: 500 }}>{user.name}</span>,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header className="navbar">
      <div className="navbar-left">
        <div className="logo">Warranty Portal</div>
      </div>

      <div className="navbar-right">
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} />
            <span className="username">{user.name}</span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;