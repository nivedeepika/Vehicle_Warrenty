const mongoose = require("mongoose");

const warrantySchema = new mongoose.Schema(
  {
    // Reference to User (Customer)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to Vehicle
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    // Issue Details
    issueCategory: {
      type: String,
      required: true,
      trim: true,
    },

    issueTitle: {
      type: String,
      required: true,
      trim: true,
    },

    issueDescription: {
      type: String,
      required: true,
    },

    issueStartDate: {
      type: Date,
      required: true,
    },

    odometerReading: {
      type: Number,
      required: true,
    },

    underWarranty: {
      type: Boolean,
      required: true,
    },

    previousService: {
      type: Boolean,
      required: true,
    },

    // Documents
    vehicleInvoice: {
      type: String,
      required: true,
    },

    rcBook: {
      type: String,
      required: true,
    },

    serviceRecords: {
      type: String,
    },

    problemPhotos: [
      {
        type: String,
      },
    ],

    problemVideo: {
      type: String,
    },

    // Dealer (optional if assigned later)
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
  type: String,
  enum: [
    "pending",
    "dealerApproved",
    "approved",
    "rejected",
  ],
  default: "pending",
},

    rejectionReason: {
      type: String,
    },

    claimId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);


// Auto-generate Claim ID
warrantySchema.pre("save", async function () {
  if (!this.claimId) {
    const random = Math.floor(100000 + Math.random() * 900000);
    this.claimId = "CLM" + random;
  }
});

module.exports = mongoose.model("Warranty", warrantySchema);