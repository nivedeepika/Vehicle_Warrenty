import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, FileText } from "lucide-react";
import "./AdminHome.css";

const AdminHome = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-home">
            <div className="admin-header">
                <ShieldCheck size={34} className="admin-icon" />
                <h1>Admin Dashboard</h1>
                <p>Manage warranty applications and approvals</p>
            </div>

            <div className="admin-cards">
                <div
                    className="admin-card"
                    onClick={() => navigate("/admin/applications")}
                >
                    <FileText size={32} className="card-icon" />
                    <h3>View Applications</h3>
                    <p>Review and approve warranty claims submitted by dealers</p>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;