import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleAction = async (endpoint, successMessage) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        alert(successMessage);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(`Error in ${endpoint}:`, error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <button onClick={() => handleAction("reset-db", "Database reset successfully!")}>
        Reset Database
      </button>
      <button onClick={() => handleAction("close-entries", "Entries closed successfully!")}>
        Close Entries
      </button>
      <button onClick={() => handleAction("allocate-courses", "Course allocation completed!")}>
        Run Allocation
      </button>
      <Link to="/allocations" className="dashboard-link">
        View Allocations
      </Link>
      <button onClick={() => navigate("/")}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
