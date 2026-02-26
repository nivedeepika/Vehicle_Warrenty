const express = require("express");
const router = express.Router();
const {
  addVehicle,
  getMyVehicles,
} = require("../controllers/vehicleController");

const { protect } = require("../middlewares/authMiddleware");
const  {authorizeRoles}  = require("../middlewares/roleMiddleware");
console.log("routes",authorizeRoles);

router.post("/add", protect, authorizeRoles("customer"), addVehicle);

router.get("/my", protect, authorizeRoles("customer"), getMyVehicles);


module.exports = router;