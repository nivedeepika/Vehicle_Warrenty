import React, { useState ,useEffect} from "react";
import { Button, message } from "antd";
import { ArrowLeft, ArrowRight, Send, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./WarrantyClaimStepper.css";

import StepperHeader from "./StpperHeader";
import StepCustomerVehicle from "./StepCustomerVehicle";
import StepIssueDetails from "./StepIssueDetails";
import StepDocumentUpload from "./StepDocumentUpload";
import StepPreviewSubmit from "./StepPreviewSubmit";
import ClaimsTable from "./ClaimTable";
import Navbar from "../Home/Navbar";
import axios from "axios";

const WarrantyClaimStepper = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [vehicle, setVehicle] = useState({
  vehicleId: "",  // ADD THIS
  model: "",
  vehicleNumber: "",
  vinNumber: "",
  purchaseDate: "",
  dealerName: "",
});

const [issue, setIssue] = useState({
  category: "",
  title: "",
  description: "",
  issueStartDate: "",
  odometerReading: "",
  underWarranty: false,
  previousService: false,
  previousServiceCount: 0,
});

  const [documents, setDocuments] = useState({
    vehicleInvoice: null,
    rcBook: null,
    serviceRecords: null,
    problemPhotos: [],
    problemVideo: null,
  });

  const [claims, setClaims] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const totalSteps = 4;

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const user = response.data;

      setCustomer({
        fullName: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        address: "",
      });

    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };

  fetchUser();
}, []);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

//   const handleSubmit = () => {
//   const claimId = `WC-${Date.now().toString(36).toUpperCase()}`;

//   const newClaim = {
//     customer,
//     vehicle,
//     issue,
//     documents,
//     submittedAt: new Date().toLocaleDateString(),
//     claimId,
//     status: "Pending Review",
//   };

//   setClaims([...claims, newClaim]);

//   message.success(`Claim Submitted Successfully! ID: ${claimId}`);

//   // Navigate after 2 seconds
//   setTimeout(() => {
//     navigate("/home");
//   }, 2000);
// };

const handleSubmit = async () => {
  if (!vehicle.vehicleId) {
  message.error("Please select a vehicle");
  return;
}
  try {
    const formData = new FormData();

    // =========================
    // TEXT FIELDS
    // =========================
    formData.append("vehicleId", vehicle.vehicleId); // Make sure you store this
    formData.append("category", issue.category);
    formData.append("title", issue.title);
    formData.append("description", issue.description);
    formData.append("issueStartDate", issue.issueStartDate);
    formData.append("odometerReading", issue.odometerReading);
    formData.append("underWarranty", issue.underWarranty);
    formData.append("previousService", issue.previousService);
    formData.append("previousServiceCount", issue.previousServiceCount);

    // =========================
    // FILES
    // =========================
    if (documents.vehicleInvoice)
      formData.append("vehicleInvoice", documents.vehicleInvoice);

    if (documents.rcBook)
      formData.append("rcBook", documents.rcBook);

    if (documents.serviceRecords)
      formData.append("serviceRecords", documents.serviceRecords);

    // Multiple photos
    if (documents.problemPhotos.length > 0) {
      documents.problemPhotos.forEach((photo) => {
        formData.append("problemPhotos", photo);
      });
    }

    if (documents.problemVideo)
      formData.append("problemVideo", documents.problemVideo);

    // =========================
    // API CALL
    // =========================
    const response = await axios.post(
      "http://localhost:5000/api/warranty/create-warranty",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    message.success(response.data.message);

    console.log("Claim Response:", response.data);

    setTimeout(() => {
      navigate("/home");
    }, 2000);

  } catch (error) {
    console.error(error);
    message.error(
      error.response?.data?.message || "Failed to submit claim"
    );
  }
};

  if (showTable) {
    return (
      <div className="wcs-container">
        <ClaimsTable
          claims={claims}
          onNewClaim={() => setShowTable(false)}
        />
      </div>
    );
  }

  const claimData = { customer, vehicle, issue, documents };

  return (
    <>
     <Navbar/>
    <div className="wcs-container">
      {/* HEADER */}
     
      <div className="wcs-header">
        <div className="wcs-badge">
          <Shield size={14} />
          Warranty Claim Portal
        </div>

        <h1>File a Warranty Claim</h1>

        <p>
          Complete the steps below to submit your vehicle warranty claim.
        </p>
      </div>

      {/* STEPPER */}
      <div className="wcs-stepper-wrapper">
        <StepperHeader currentStep={currentStep} />
      </div>

      {/* STEP CONTENT */}
      <div className="wcs-step-content">
        {currentStep === 0 && (
          <StepCustomerVehicle
            customer={customer}
            vehicle={vehicle}
            onCustomerChange={(d) => setCustomer({ ...customer, ...d })}
            onVehicleChange={(d) => setVehicle({ ...vehicle, ...d })}
          />
        )}

        {currentStep === 1 && (
          <StepIssueDetails
            issue={issue}
            onIssueChange={(d) => setIssue({ ...issue, ...d })}
          />
        )}

        {currentStep === 2 && (
          <StepDocumentUpload
            documents={documents}
            onDocumentsChange={(d) =>
              setDocuments({ ...documents, ...d })
            }
          />
        )}

        {currentStep === 3 && (
          <StepPreviewSubmit
            data={claimData}
            onEditStep={(s) => setCurrentStep(s)}
          />
        )}
      </div>

      {/* NAVIGATION */}
      <div className="wcs-nav-buttons">
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          icon={<ArrowLeft size={14} />}
        >
          Back
        </Button>

        {currentStep < totalSteps - 1 ? (
          <Button
            type="primary"
            onClick={handleNext}
            icon={<ArrowRight size={14} />}
          >
            Next
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={handleSubmit}
            icon={<Send size={14} />}
            className="wcs-submit-btn"
          >
            Submit Claim
          </Button>
        )}
      </div>

      {/* VIEW CLAIMS */}
      {claims.length > 0 && (
        <div className="wcs-view-claims">
          <Button type="link" onClick={() => setShowTable(true)}>
            View {claims.length} submitted claim(s)
          </Button>
        </div>
      )}
    </div>
    </>
  );
};

export default WarrantyClaimStepper;