const express = require("express");
const router = express.Router();

const {
  createClaim,
  getClaims,
  getSingleClaim,
  deleteClaim,
  updateClaimStatus, // ✅ ADD THIS
} = require("../controllers/warrentyController");

const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// =====================================
// CUSTOMER ONLY
// =====================================

// Create Warranty
router.post(
  "/create-warranty",
  protect,
  authorizeRoles("customer"),
  upload.fields([
    { name: "vehicleInvoice", maxCount: 1 },
    { name: "rcBook", maxCount: 1 },
    { name: "serviceRecords", maxCount: 1 },
    { name: "problemVideo", maxCount: 1 },
    { name: "problemPhotos", maxCount: 5 },
  ]),
  createClaim
);
// =====================================
// DEALER / ADMIN UPDATE STATUS
// =====================================
router.put(
  "/update-status/:id",
  protect,
  authorizeRoles("dealer", "admin"),
  updateClaimStatus
);

// Delete Warranty (customer can delete own)
router.delete(
  "/delete-warranty/:id",
  protect,
  authorizeRoles("customer"),
  deleteClaim
);


// =====================================
// CUSTOMER / DEALER / ADMIN
// =====================================

// Get All Warranties
router.get(
  "/get-warranties",
  protect,
  authorizeRoles("customer", "dealer", "admin"),
  getClaims
);

// Get Single Warranty
router.get(
  "/get-warranty/:id",
  protect,
  authorizeRoles("customer", "dealer", "admin"),
  getSingleClaim
);

module.exports = router;