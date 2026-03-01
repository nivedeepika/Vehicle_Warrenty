const WarrantyClaim = require("../models/Service");
const Vehicle = require("../models/Vehicle");


// ===============================
// CREATE CLAIM (Customer Only)
// ===============================
exports.createClaim = async (req, res) => {
  try {
    const {
      vehicleId,
      category,
      title,
      description,
      issueStartDate,
      odometerReading,
      underWarranty,
      previousService,
      previousServiceCount,
    } = req.body;

    // Validate vehicle ownership
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      userId: req.user._id,
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Handle uploaded files
    const files = req.files;

    const vehicleInvoice =
      files.vehicleInvoice?.[0]?.path || null;

    const rcBook =
      files.rcBook?.[0]?.path || null;

    const serviceRecords =
      files.serviceRecords?.[0]?.path || null;

    const problemVideo =
      files.problemVideo?.[0]?.path || null;

    const problemPhotos =
      files.problemPhotos?.map((f) => f.path) || [];

    // Validate mandatory docs
    if (!vehicleInvoice || !rcBook) {
      return res
        .status(400)
        .json({ message: "Invoice and RC Book required" });
    }

   const claim = await WarrantyClaim.create({
  user: req.user._id,
  vehicle: vehicleId,

  issueCategory: category,
  issueTitle: title,
  issueDescription: description,
  issueStartDate,
  odometerReading,
  underWarranty,
  previousService,

  vehicleInvoice,
  rcBook,
  serviceRecords,
  problemPhotos,
  problemVideo,

});

    res.status(201).json({
      message: "Claim submitted successfully",
      claim,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// ==========================================
// GET CLAIMS (Role Based)
// ==========================================
exports.getClaims = async (req, res) => {
  try {
    let filter = {};

    // Customer → only their claims
    if (req.user.role === "customer") {
      filter.user = req.user._id;
    }

    // Dealer → only pending claims
    if (req.user.role === "dealer") {
      filter.status = "pending";
    }

    // Admin → only dealerApproved claims
    if (req.user.role === "admin") {
      filter.status = "dealerApproved";
    }

    const claims = await WarrantyClaim.find(filter)
      .populate("user", "name email phone")
      .populate("vehicle", "model vehicleNumber")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// GET SINGLE CLAIM
// ==========================================
exports.getSingleClaim = async (req, res) => {
  try {
    let filter = { _id: req.params.id };

    if (req.user.role === "customer") {
      filter.user = req.user._id;
    }

    const claim = await WarrantyClaim.findOne(filter)
      .populate("user", "name email phone")
      .populate("vehicle", "model vehicleNumber");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ==========================================
// UPDATE STATUS (Admin / Dealer)
// ==========================================
exports.updateClaimStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const claim = await WarrantyClaim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // ==========================
    // DEALER LOGIC
    // ==========================
    if (req.user.role === "dealer") {
      // Dealer can act only on pending claims
      if (claim.status !== "pending") {
        return res.status(400).json({
          message: "Dealer can only process pending claims",
        });
      }

      if (status === "approved") {
        claim.status = "dealerApproved";
      } 
      else if (status === "rejected") {
        claim.status = "rejected";
        claim.rejectionReason = rejectionReason || "Rejected by dealer";
      } 
      else {
        return res.status(400).json({
          message: "Invalid status value",
        });
      }
    }

    // ==========================
    // ADMIN LOGIC
    // ==========================
    if (req.user.role === "admin") {
      // Admin can act only after dealer approval
      if (claim.status !== "dealerApproved") {
        return res.status(400).json({
          message: "Dealer approval required first",
        });
      }

      if (status === "approved") {
        claim.status = "approved";
      } 
      else if (status === "rejected") {
        claim.status = "rejected";
        claim.rejectionReason = rejectionReason || "Rejected by admin";
      } 
      else {
        return res.status(400).json({
          message: "Invalid status value",
        });
      }
    }

    await claim.save();

    res.json({
      message: "Claim status updated successfully",
      claim,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// DELETE CLAIM (Customer Only)
// ==========================================
exports.deleteClaim = async (req, res) => {
  try {
    const claim = await WarrantyClaim.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.json({ message: "Claim deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};