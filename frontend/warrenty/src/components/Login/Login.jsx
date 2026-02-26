import React, { useState } from "react";
import "./Login.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaFacebookF,
  FaGoogle,
  FaLinkedinIn,
} from "react-icons/fa";
import { loginUser } from "../../api/login";
import { registerUser } from "../../api/register";
import { useNavigate } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const navigate = useNavigate();

  /* HANDLE CHANGE */
  const handleChange = (e, type) => {
    const { name, value } = e.target;

    if (type === "login") {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  /* VALIDATION */
  const validateLogin = () => {
    if (!loginData.username || !loginData.password) {
      toast.error("All login fields are required");
      return false;
    }
    return true;
  };

  const validateRegister = () => {
    const { name, email, mobile, password } = registerData;

    if (!name || !email || !mobile || !password) {
      toast.error("All fields are required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (mobile.length !== 10) {
      toast.error("Mobile must be 10 digits");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  /* SUBMIT */
  const handleLogin = async () => {
  if (!validateLogin()) return;

  try {
    const response = await loginUser({
      email: loginData.username,
      password: loginData.password,
    });

    toast.success("Login Successful 🚀");

    // 🔥 ROLE BASED REDIRECT
    if (response.role === "admin") {
      navigate("/admin");
    } 
    else if (response.role === "dealer") {
      navigate("/dealer");
    } 
    else {
      navigate("/customer");
    }

    // Clear form
    setLoginData({
      username: "",
      password: "",
    });

  } catch (error) {
    toast.error(error.message || "Invalid Credentials ❌");
  }
};
 const handleRegister = async () => {
  if (!validateRegister()) return;

  try {
    await registerUser(registerData);

    toast.success("Registered Successfully 🎉");

    // Clear form
    setRegisterData({
      name: "",
      email: "",
      mobile: "",
      password: "",
    });

    // 🔥 Navigate to Login Page
    setTimeout(() => {
      navigate("/");
    }, 1500); // small delay so user can see toast

  } catch (error) {
    toast.error(error.message || "Registration Failed ❌");
  }
};

  return (
    <div className={`container ${isRegister ? "active" : ""}`}>
      <div className="card">
        {/* BLUE PANEL */}
        <div className="blue-panel">
          <h1>{isRegister ? "Welcome Back!" : "WELCOME"}</h1>

          <p>
            {isRegister
              ? "Already have an account? Login here"
              : "Start your journey with us"}
          </p>

          <button
            className="ghost-btn"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "SIGN IN" : "SIGN UP"}
          </button>
        </div>

        {/* FORM PANEL */}
        <div className="form-panel">
          {/* LOGIN */}
          <div className="form login-form">
            <h2>Sign in</h2>

            <div className="input-box">
              <FaUser className="icon" />
             <input
  type="text"
  name="username"
  placeholder="Email"
  value={loginData.username}
  onChange={(e) => handleChange(e, "login")}
/>
            </div>

            <div className="input-box">
              <FaLock className="icon" />
              <input
  type="password"
  name="password"
  placeholder="Password"
  value={loginData.password}
  onChange={(e) => handleChange(e, "login")}
/>
            </div>

            <button className="login-btn" onClick={handleLogin}>
              LOGIN
            </button>

            <p className="social-text">Or sign in with</p>

            <div className="social-icons">
              <div className="circle fb">
                <FaFacebookF />
              </div>
              <div className="circle google">
                <FaGoogle />
              </div>
              <div className="circle twitter">
                <FaXTwitter />
              </div>
              <div className="circle linkedin">
                <FaLinkedinIn />
              </div>
            </div>
          </div>

          {/* REGISTER */}
          <div className="form register-form">
            <h2>Create Account</h2>

            <div className="input-box">
              <FaUser className="icon" />
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={(e) => handleChange(e, "register")}
              />
            </div>

            <div className="input-box">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={(e) => handleChange(e, "register")}
              />
            </div>

            <div className="input-box">
              <FaPhone className="icon" />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                onChange={(e) => handleChange(e, "register")}
              />
            </div>

            <div className="input-box">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={(e) => handleChange(e, "register")}
              />
            </div>

            <button className="login-btn" onClick={handleRegister}>
              REGISTER
            </button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Login;



