const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ If no token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // =========================
    // STATIC ADMIN
    // =========================
    if (decoded.role === "admin") {
      req.user = {
        _id: "admin-id",
        name: "Admin",
        role: "admin",
      };
      return next();
    }

    // =========================
    // STATIC DEALER
    // =========================
    if (decoded.role === "dealer") {
      req.user = {
        _id: "dealer-id",
        name: "Dealer",
        role: "dealer",
      };
      return next();
    }

    // =========================
    // CUSTOMER (FROM DATABASE)
    // =========================
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    return next();

  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};