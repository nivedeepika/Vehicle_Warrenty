const express = require("express");
const router = express.Router();

const {
  applyWarranty,
  getMyWarrantyRequests,
  getDealerRequests,
  updateWarrantyStatus,
} = require("../controllers/warrentyController");

const { protect } = require("../middlewares/authMiddleware");
const { authorizeRoles } = require("../middlewares/roleMiddleware");

/*
---------------------------------------
Customer Routes
---------------------------------------
*/
router.post(
  "/apply",
  protect,
  authorizeRoles("customer"),
  applyWarranty
);

router.get(
  "/my",
  protect,
  authorizeRoles("customer"),
  getMyWarrantyRequests
);

/*
---------------------------------------
Dealer Routes
---------------------------------------
*/
router.get(
  "/dealer",
  protect,
  authorizeRoles("dealer"),
  getDealerRequests
);

router.put(
  "/update-status",
  protect,
  authorizeRoles("dealer"),
  updateWarrantyStatus
);

module.exports = router;