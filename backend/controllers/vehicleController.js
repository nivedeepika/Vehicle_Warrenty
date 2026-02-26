const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");

/*
---------------------------------------------------
Add Vehicle (Customer Only)
---------------------------------------------------
*/
exports.addVehicle = async (req, res) => {
  try {
    const { vehicleNumber, model, purchaseDate } = req.body;

    // 1️⃣ Validate required fields
    if (!vehicleNumber || !model || !purchaseDate) {
      return res.status(400).json({
        success: false,
        message: "Vehicle number, model and purchase date are required",
      });
    }

    // 2️⃣ Validate logged in user
    if (!req.user || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(401).json({
        success: false,
        message: "Invalid or unauthorized user",
      });
    }

    // 3️⃣ Check duplicate vehicle number
    const existingVehicle = await Vehicle.findOne({
      vehicleNumber: vehicleNumber.toUpperCase(),
    });

    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle already registered",
      });
    }

    // 4️⃣ Create vehicle
    const vehicle = await Vehicle.create({
      userId: req.user._id,
      vehicleNumber,
      model,
      purchaseDate,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: vehicle,
    });

  } catch (error) {
    console.error("Add Vehicle Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/*
---------------------------------------------------
Get My Vehicles
---------------------------------------------------
*/
exports.getMyVehicles = async (req, res) => {
  try {
    if (!req.user || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const vehicles = await Vehicle.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalVehicles: vehicles.length,
      data: vehicles,
    });

  } catch (error) {
    console.error("Get Vehicles Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};