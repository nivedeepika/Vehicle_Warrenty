import React from "react";
import { Layout } from "antd";
import Navbar from "../Navbar/Navbar";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Content style={{ padding: "40px", background: "#f5f7fa" }}>
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout;