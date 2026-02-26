const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =======================
// REGISTER (Customer Only)
// =======================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Block admin & dealer registration
    if (email === "admin@gmail.com" || email === "deal@gmail.com") {
      return res.status(403).json({ message: "Not allowed to register" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "customer",
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// LOGIN
// =======================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // =========================
    // STATIC ADMIN LOGIN
    // =========================
    if (email === "admin@gmail.com" && password === "admin123") {
      const token = generateToken("admin-id", "admin");

      return res.json({
        name: "Admin",
        email,
        role: "admin",
        token,
      });
    }

    // =========================
    // STATIC DEALER LOGIN
    // =========================
    if (email === "deal@gmail.com" && password === "dealer123") {
      const token = generateToken("dealer-id", "dealer");

      return res.json({
        name: "Dealer",
        email,
        role: "dealer",
        token,
      });
    }

    // =========================
    // CUSTOMER LOGIN
    // =========================
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};