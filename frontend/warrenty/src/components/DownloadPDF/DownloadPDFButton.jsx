import React from "react";
import { Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { generateWarrantyPDF } from "../../utils/generateWarrantyPDF";
import "./DownloadPDFButton.css";

const DownloadPDFButton = ({ claim }) => {
  if (claim.status !== "Approved") return null;

  return (
    <Tooltip title="Download Warranty Approval PDF">
      <DownloadOutlined
        className="pdf-download-icon"
        onClick={() => generateWarrantyPDF(claim)}
      />
    </Tooltip>
  );
};

export default DownloadPDFButton;