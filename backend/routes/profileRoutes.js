const express = require("express");
const router = express.Router();
const {protect} = require("../middlewares/authMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/profileController");

/* =========================
   PROFILE ROUTES
========================= */

// Get Profile
router.get("/profile", protect, getProfile);

// Update Profile
router.put("/profile", protect, updateProfile);

// Change Password
router.put("/profile/change-password", protect, changePassword);

// Delete Account
router.delete("/profile", protect, deleteAccount);

module.exports = router;