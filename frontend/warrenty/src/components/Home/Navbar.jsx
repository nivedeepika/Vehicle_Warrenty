import React from "react";
import "./Navbar.css";
import { Avatar, Dropdown, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import WarrantyLogo from "../../asset/Logo.png";

function Navbar() {
  const navigate = useNavigate();

  // ✅ Get user from localStorage
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Invalid user data in localStorage");
    localStorage.removeItem("user");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"), // ✅ FIXED HERE
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
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
    <div className="oz-nav">
      {/* LEFT - LOGO + TITLE */}
      <div className="oz-nav-left">
        <img
          src={WarrantyLogo}
          alt="Warranty Logo"
          className="oz-nav-logo-img"
        />
        <div className="oz-nav-logo-text">
          Ozotec Warranty Claim System
        </div>
      </div>

      {/* CENTER - MENU */}
      <div className="oz-nav-menu">
        <Link to="/home">Home</Link>
        <Link to="/warranty">Warranty</Link>
        <Link to="/add-vehicle" className="add-vehicle-link">
          Vehicle
        </Link>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>

      {/* RIGHT - PROFILE DROPDOWN */}
      <div className="oz-nav-right">
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              size={36}
              icon={<UserOutlined />}
              className="white-border-avatar"
            />
            <span className="username">
              {user ? user.name : "Guest"}
            </span>
          </Space>
        </Dropdown>
      </div>
    </div>
  );
}

export default Navbar;