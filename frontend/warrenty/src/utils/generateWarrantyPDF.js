import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import signImage from "../asset/sign.png";
import companyLogo from "../asset/Logo.png";

const COMPANY_NAME =
  process.env.REACT_APP_COMPANY_NAME ||
  "OZOTEC AUTOMOBILE PVT LTD";

const COMPANY_ADDRESS =
  "9940722230  |  2/217C Hopes  |  Coimbatore - 641048";

export const generateWarrantyPDF = (claim = {}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  const status = claim.status?.toUpperCase() || "PENDING";
  const isApproved = status === "APPROVED";
  const isRejected = status === "REJECTED";

  // ================= HEADER =================

  // Logo (margin-right:10 simulated by shifting X to 20)
  // margin-bottom:10 simulated by moving divider line lower
  if (companyLogo) {
    doc.addImage(companyLogo, "PNG", 10, 12, 38, 38);
  }

  // Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(COMPANY_NAME.toUpperCase(), pageWidth / 2, 25, {
    align: "center",
  });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(
    "Authorized Warranty Claim Document",
    pageWidth / 2,
    33,
    { align: "center" }
  );

  // Address
  doc.setFontSize(11);
  doc.text(COMPANY_ADDRESS, pageWidth / 2, 39, {
    align: "center",
  });

  // Divider moved down (margin-bottom effect)
  doc.line(15, 50, pageWidth - 15, 50);

  // ================= TITLE =================
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("WARRANTY CLAIM REPORT", pageWidth / 2, 60, {
    align: "center",
  });

  const tableStyles = {
    theme: "grid",
    styles: {
      fontSize: 11,
      cellPadding: 3,
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: "bold" },
      1: { cellWidth: 120 },
    },
  };

  // ================= CLAIM SUMMARY =================
  autoTable(doc, {
    startY: 70,
    ...tableStyles,
    body: [
      ["Claim ID", claim.claimId || "-"],
      ["Status", status],
      [
        "Decision Date",
        isApproved || isRejected
          ? new Date(claim.updatedAt).toLocaleDateString()
          : "-",
      ],
    ],
  });

  // ================= CUSTOMER =================
  doc.text("Customer Information", 15, doc.lastAutoTable.finalY + 12);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    ...tableStyles,
    body: [
      ["Customer Name", claim.user?.name || "-"],
      ["Email", claim.user?.email || "-"],
    ],
  });

  // ================= VEHICLE =================
  doc.text("Vehicle Information", 15, doc.lastAutoTable.finalY + 12);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    ...tableStyles,
    body: [
      ["Vehicle Number", claim.vehicle?.vehicleNumber || "-"],
      ["Model", claim.vehicle?.model || "-"],
      ["Odometer Reading", claim.odometerReading || "-"],
      ["Under Warranty", claim.underWarranty ? "Yes" : "No"],
    ],
  });

  // ================= ISSUE =================
  doc.text("Issue Details", 15, doc.lastAutoTable.finalY + 12);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    ...tableStyles,
    body: [
      ["Category", claim.issueCategory || "-"],
      ["Issue Title", claim.issueTitle || "-"],
      ["Description", claim.issueDescription || "-"],
      [
        "Issue Start Date",
        claim.issueStartDate
          ? new Date(claim.issueStartDate).toLocaleDateString()
          : "-",
      ],
    ],
  });

  // ================= REJECTION =================
  if (isRejected) {
    doc.setFont("helvetica", "bold");
    doc.text("Rejection Reason", 15, doc.lastAutoTable.finalY + 12);

    doc.setFont("helvetica", "normal");
    doc.text(
      claim.rejectionReason || "Not Provided",
      15,
      doc.lastAutoTable.finalY + 20,
      { maxWidth: pageWidth - 30 }
    );
  }

  // ================= SIGNATURE =================
  const signY = 250;

  if (isApproved && signImage) {
   doc.addImage(signImage, "PNG", 150, signY+5, 30, 12);
  }



  // margin-top:20 applied here
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatory", 165, signY + 20, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_NAME, 165, signY + 26, {
    align: "center",
  });

  // ================= FOOTER =================
  doc.setFontSize(9);
  doc.text(
    `This is a system-generated document issued by ${COMPANY_NAME}.`,
    pageWidth / 2,
    285,
    { align: "center" }
  );

  doc.save(`Warranty_Claim_${claim.claimId || "Document"}.pdf`);
};