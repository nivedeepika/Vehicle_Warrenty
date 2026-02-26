const mongoose = require("mongoose");

const warrantyRequestSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dealerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // STEP 1 – Personal Details
        fullName: { type: String, required: true },
        age: { type: Number },
        gender: { type: String },

        // STEP 2 – Contact Details
        email: { type: String },
        mobile: { type: String },
        address: { type: String },

        // STEP 3 – Invoice Details
        invoiceNumber: { type: String, required: true },
        invoiceDate: { type: Date, required: true },
        purchaseAmount: { type: Number },

        // STEP 4 – Vehicle Details (Snapshot copy)
        vehicleNumber: { type: String },
        model: { type: String },

        // STEP 5 – Issue
        issueDescription: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

    rejectionReason: { type: String },

    },
    { timestamps: true }
);

module.exports = mongoose.model("WarrantyRequest", warrantyRequestSchema);