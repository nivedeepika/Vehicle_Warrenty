import React, { useState } from "react";
import "./Register.css";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { registerUser } from "../../api/register";

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Submit
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await registerUser(formData);

      alert("Registration Successful ✅");

      // Clear form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: ""
      });

    } catch (error) {
      alert(error.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">

        {/* LEFT PANEL */}
        <div className="left-panel">
          <h1>Welcome Back!</h1>
          <p>
            Already have an account? Sign in to continue your journey.
          </p>

          <div className="illustration">
            <img src="/login_image.jpeg" alt="illustration" />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <h2>Create Account</h2>

          <div className="input-box">
            <FaUser className="icon" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <FaPhone className="icon" />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="input-box">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            className="register-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Registering..." : "REGISTER"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Register;