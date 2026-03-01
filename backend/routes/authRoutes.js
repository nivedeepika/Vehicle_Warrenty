const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,getMe
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
// =======================
// CUSTOMER DASHBOARD
// =======================
router.get(
  "/customer/dashboard",
  protect,
  authorizeRoles("customer"),
  (req, res) => {
    res.json({
      message: `Welcome Customer ${req.user.name}`,
    });
  }
);

// =======================
// ADMIN DASHBOARD
// =======================
router.get(
  "/admin/dashboard",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin Dashboard",
    });
  }
);

// =======================
// DEALER DASHBOARD
// =======================
router.get(
  "/dealer/dashboard",
  protect,
  authorizeRoles("dealer"),
  (req, res) => {
    res.json({
      message: "Welcome Dealer Dashboard",
    });
  }
);

module.exports = router;