const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    warrantyExpiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Company fixed warranty period
const WARRANTY_PERIOD_YEARS = 2;

// Auto calculate warranty expiry
vehicleSchema.pre("save", function () {
  const expiry = new Date(this.purchaseDate);
  expiry.setFullYear(expiry.getFullYear() + 2);
  this.warrantyExpiryDate = expiry;
});

module.exports = mongoose.model("Vehicle", vehicleSchema);