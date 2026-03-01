import React, { useState } from "react";
import "./Home.css";
import Navbar from "./Navbar";
import { Row, Col, Card, Button } from "antd";
import { useNavigate, Link } from "react-router-dom";

import {
  UserOutlined,
  FileDoneOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  AimOutlined,
  RocketOutlined,
} from "@ant-design/icons";

function Home() {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);

  const cardContent = {
    1: "Create your account securely and login to access the warranty system. This ensures your vehicle data is protected and accessible anytime.",
    2: "Submit detailed warranty claims with proper issue descriptions, documents, and supporting evidence for faster approvals.",
    3: "Track your claim status in real-time with updates from the service team and get notified on approval stages.",
    4: "Ozotec is a leading automobile solutions provider delivering innovation and digital transformation in vehicle service systems.",
    5: "Our mission is to provide reliable, efficient, and transparent warranty claim systems for all customers.",
    6: "Our vision is to revolutionize the automobile service industry with cutting-edge digital solutions and customer-first approach.",
  };

const warrantyCards = [
  {
    id: 1,
    icon: (
      <div className="oz-icon-wrapper">
        <UserOutlined />
      </div>
    ),
    title: "Register & Login",
    desc: "Create a secure account and access all warranty services easily.",
  },
  {
    id: 2,
    icon: (
      <div className="oz-icon-wrapper">
        <FileDoneOutlined />
      </div>
    ),
    title: "Submit Claim",
    desc: "Provide complete details and documents for faster claim approval.",
  },
  {
    id: 3,
    icon: (
      <div className="oz-icon-wrapper">
        <CheckCircleOutlined />
      </div>
    ),
    title: "Track Status",
    desc: "Monitor real-time updates and approval progress of your claim.",
  },
];
const aboutCards = [
  {
    id: 4,
    icon: (
      <div className="oz-icon-wrapper">
        <InfoCircleOutlined />
      </div>
    ),
    title: "Company Overview",
    desc: "Providing innovative automobile service solutions with digital transformation expertise.",
  },
  {
    id: 5,
    icon: (
      <div className="oz-icon-wrapper">
        <AimOutlined />
      </div>
    ),
    title: "Our Mission",
    desc: "Deliver reliable, transparent and customer-focused warranty management systems.",
  },
  {
    id: 6,
    icon: (
      <div className="oz-icon-wrapper">
        <RocketOutlined />
      </div>
    ),
    title: "Our Vision",
    desc: "Revolutionize automobile services through advanced and smart digital platforms.",
  },
];

  return (
    <>
      <div className={`oz-home ${activeCard ? "oz-blur" : ""}`}>
        <Navbar />

        {/* HERO */}
        <section id="home" className="oz-hero">
          <div className="oz-overlay">
            <h1>Welcome to Ozotec Warranty Claim Management System</h1>
            <div className="oz-typing-wrapper">
              <p className="oz-typing">
                Apply, Track and Manage Your Vehicle Warranty Claims Easily
              </p>
            </div>
            <div className="oz-hero-buttons">
  <Link to="/warranty">
    <Button type="primary" size="large">
      Apply Warranty Claim
    </Button>
  </Link>

  <Link to="/my-claims">
    <Button size="large" className="oz-secondary-btn">
      My Warranty Forms
    </Button>
  </Link>
</div>
          </div>
        </section>

        {/* WARRANTY */}
        <section id="warranty" className="oz-section">
          <h2>Warranty Process</h2>
          <Row gutter={[24, 24]}>
            {warrantyCards.map((card) => (
              <Col xs={24} md={8} key={card.id}>
                <Card className="oz-card" hoverable>
                  {card.icon}
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <span
                    className="oz-view-more"
                    onClick={() => setActiveCard(card.id)}
                  >
                    View More →
                  </span>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* ABOUT */}
        <section id="about" className="oz-section oz-alt">
          <h2>About Ozotec Automobile Pvt Ltd</h2>
          <Row gutter={[24, 24]}>
            {aboutCards.map((card) => (
              <Col xs={24} md={8} key={card.id}>
                <Card className="oz-card" hoverable>
                  {card.icon}
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <span
                    className="oz-view-more"
                    onClick={() => setActiveCard(card.id)}
                  >
                    View More →
                  </span>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* CONTACT */}
        {/* CONTACT */}
<section id="contact" className="oz-section oz-contact-section">
  <h2 className="contact-title">Contact Us</h2>

  <div className="contact-wrapper">
    {/* FORM */}
    <div className="contact-form-grid">
      <div className="form-row">
        <input placeholder="Name" />
        <input placeholder="Email" />
      </div>

      <div className="form-row">
        <input placeholder="Phone" />
        <input placeholder="Subject" />
      </div>

      <div className="form-row full">
        <textarea placeholder="Message" rows="5" />
      </div>

      <div className="submit-center">
        <Button type="primary" size="large">
          Submit
        </Button>
      </div>
    </div>

    {/* CONTACT INFO BOTTOM CENTER */}
    <div className="contact-info-row">
      <div><strong>Address:</strong> Coimbatore, Tamil Nadu</div>
      <div><strong>Email:</strong> support@ozotec.com</div>
      <div><strong>Phone:</strong> +91 9876543210</div>
    </div>
  </div>
</section>

        {/* FOOTER */}
        <footer className="oz-footer">
          © 2026 Ozotec Automobile Pvt Ltd. All Rights Reserved.
        </footer>
      </div>

      {/* MODAL (Outside Blur Container) */}
      {activeCard && (
        <div className="oz-modal">
          <div className="oz-modal-content">
            <h2>Details</h2>
            <p>{cardContent[activeCard]}</p>
            <Button onClick={() => setActiveCard(null)}>Back</Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
