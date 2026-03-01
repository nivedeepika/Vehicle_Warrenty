import React from "react";
import { Button, Tag, Divider } from "antd";
import { Edit2, FileText, CheckCircle2 } from "lucide-react";
import "./StepPreviewSubmit.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

/* Section Header */
const SectionHeader = ({ title, stepIndex, onEdit }) =>
  (
  
  <div className="wc-preview-section-header">
    <h4>{title}</h4>

    <Button
      type="text"
      className="wc-preview-edit-btn"
      onClick={() => onEdit(stepIndex)}
    >
      <Edit2 size={14} />
      Edit
    </Button>
  </div>
);

/* Info Row */
const InfoRow = ({ label, value }) => (
  <div className="wc-preview-info-row">
    <span className="wc-preview-label">{label}</span>
    <span className="wc-preview-value">{value || "—"}</span>
  </div>
);

const StepPreviewSubmit = ({ data, onEditStep }) => {
  const documents = data?.documents || {};

const docCount =
  [
    documents.vehicleInvoice,
    documents.rcBook,
    documents.serviceRecords,
    documents.problemVideo,
  ].filter(Boolean).length +
  (documents.problemPhotos?.length || 0);

const navigate = useNavigate();

    const handleSubmit = () => {
  toast.success("Warranty submitted successfully 🎉", {
    position: "top-right",
    autoClose: 2000,
  });

  setTimeout(() => {
    navigate("/home");
  }, 2000);
};
  return (
    <div className="wc-preview-container">

      <div className="wc-preview-card">

        {/* Header */}
        <div className="wc-preview-header">
          <CheckCircle2 size={20} className="wc-preview-success-icon" />
          <h3>Review Your Claim</h3>
        </div>

        <p className="wc-preview-subtitle">
          Please verify all details before submitting
        </p>

        {/* Customer */}
        <SectionHeader
  title="✅ Customer Details"
  stepIndex={0}
  onEdit={onEditStep}
/>

        <div className="wc-preview-box">
          <InfoRow label="Full Name" value={data.customer.fullName} />
          <InfoRow label="Email" value={data.customer.email} />
          <InfoRow label="Mobile" value={data.customer.mobile} />
          <InfoRow label="Address" value={data.customer.address} />
        </div>

        <Divider />

        {/* Vehicle */}
       <SectionHeader
  title="✅ Vehicle Details"
  stepIndex={1}
  onEdit={onEditStep}
/>

        <div className="wc-preview-box">
          <InfoRow label="Model" value={data.vehicle.model} />
          <InfoRow label="Vehicle Number" value={data.vehicle.vehicleNumber} />
          <InfoRow label="VIN / Chassis" value={data.vehicle.vinNumber} />
          <InfoRow label="Purchase Date" value={data.vehicle.purchaseDate} />
          <InfoRow label="Dealer" value={data.vehicle.dealerName} />
        </div>

        <Divider />

        {/* Issue */}
        <SectionHeader
  title="✅ Issue Details"
  stepIndex={2}
  onEdit={onEditStep}
/>

        <div className="wc-preview-box">
          <InfoRow label="Category" value={data.issue.category} />
          <InfoRow label="Issue Title" value={data.issue.title} />
          <InfoRow label="Description" value={data.issue.description} />
          <InfoRow label="Issue Start Date" value={data.issue.issueStartDate} />
          <InfoRow
            label="Odometer"
            value={
              data.issue.odometerReading
                ? `${data.issue.odometerReading} km`
                : "-"
            }
          />

          <div className="wc-preview-badge-row">
            <Tag color={data.issue.underWarranty === "yes" ? "blue" : "default"}>
              Warranty: {data.issue.underWarranty === "yes" ? "Yes" : "No"}
            </Tag>

            <Tag>
              Previous Service:{" "}
              {data.issue.previousService === "yes" ? "Yes" : "No"}
            </Tag>
          </div>
        </div>

        <Divider />

        {/* Documents */}
        <SectionHeader
  title="✅ Uploaded Documents"
  stepIndex={3}
  onEdit={onEditStep}
/>

        <div className="wc-preview-box">
          <div className="wc-preview-doc-count">
            <FileText size={16} />
            <span>{docCount} document(s) uploaded</span>
          </div>

          <ul className="wc-preview-doc-list">
            {data.documents.vehicleInvoice && (
              <li>• Vehicle Invoice: {data.documents.vehicleInvoice.name}</li>
            )}
            {data.documents.rcBook && (
              <li>• RC Book: {data.documents.rcBook.name}</li>
            )}
            {data.documents.serviceRecords && (
              <li>• Service Records: {data.documents.serviceRecords.name}</li>
            )}
            {data.documents.problemPhotos.map((f, i) => (
              <li key={i}>• Photo: {f.name}</li>
            ))}
            {data.documents.problemVideo && (
              <li>• Video: {data.documents.problemVideo.name}</li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default StepPreviewSubmit;