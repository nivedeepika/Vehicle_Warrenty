const mongoose = require("mongoose");
const WarrantyRequest = require("../models/Service");
const Vehicle = require("../models/Vehicle");
const Service = require("../models/Service");




/*
====================================================
CUSTOMER – APPLY WARRANTY (Stepper Version)
====================================================
*/
exports.applyWarranty = async (req, res) => {
  try {
    const {
      vehicleId,
      dealerId,

      fullName,
      age,
      gender,

      email,
      mobile,
      address,

      invoiceNumber,
      invoiceDate,
      purchaseAmount,

      issueDescription,
    } = req.body;

    if (!vehicleId || !dealerId || !invoiceNumber || !invoiceDate || !issueDescription) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      userId: req.user._id,
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // ✅ Check 2 year warranty validity
    const today = new Date();

    if (today > vehicle.warrantyExpiryDate) {
      return res.status(400).json({
        message: "Warranty period expired (2 years over)",
      });
    }

    // ✅ Auto approve initially
    const request = await WarrantyRequest.create({
      vehicleId,
      customerId: req.user._id,
      dealerId,

      fullName,
      age,
      gender,

      email,
      mobile,
      address,

      invoiceNumber,
      invoiceDate,
      purchaseAmount,

      vehicleNumber: vehicle.vehicleNumber,
      model: vehicle.model,

      issueDescription,

      
    });

    return res.status(201).json({
      message: "Warranty request auto-approved successfully",
      request,
    });

  } catch (error) {
    console.error("Apply Warranty Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};



/*
====================================================
2️⃣ CUSTOMER – VIEW MY REQUESTS
====================================================
*/
exports.getMyWarrantyRequests = async (req, res) => {
  try {
    const requests = await WarrantyRequest.find({
      customerId: req.user._id,
    })
      .populate("vehicleId")
      .populate("dealerId", "name email mobile")
      .sort({ createdAt: -1 });

    res.json({
      total: requests.length,
      requests,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/*
====================================================
3️⃣ DEALER – VIEW ASSIGNED REQUESTS
====================================================
*/
exports.getDealerRequests = async (req, res) => {
  try {
    const requests = await WarrantyRequest.find({
      dealerId: req.user._id,
    })
      .populate("vehicleId")
      .populate("customerId", "name email mobile")
      .sort({ createdAt: -1 });

    res.json({
      total: requests.length,
      requests,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/*
====================================================
4️⃣ DEALER – APPROVE / REJECT
====================================================
*/
exports.updateWarrantyStatus = async (req, res) => {
  try {
    const { requestId, status, rejectionReason } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({
        message: "Request ID and status are required"
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const request = await WarrantyRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Ensure dealer owns this request
    if (request.dealerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = status;

    if (status === "rejected") {
      request.rejectionReason = rejectionReason || "Not specified";
    } else {
      request.rejectionReason = undefined;
    }

    await request.save();

    return res.json({
      message: `Warranty ${status} successfully`,
      request
    });

  } catch (error) {
    console.error("Update Warranty Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};