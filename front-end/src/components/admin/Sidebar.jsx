import React from "react";
import { useNavigate } from "react-router-dom";
import "../admin/CSS/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      localStorage.clear(); 
      navigate("/login"); 
    }
  };

  return (
    <div className="sidebar">
      <button onClick={() => navigate("/adminhome")}>Home</button>
      <button onClick={() => navigate("/Books")}>Books</button>
      <button onClick={() => navigate("/addbooks")}>Add Books</button>
      <button onClick={() => navigate("/issuedbooks")}>Issued Books</button>
      <button onClick={() => navigate("/borrowrequest")}>Borrow Request</button>
      <button onClick={() => navigate("/staffs")}>Staffs</button>
      <button onClick={() => navigate("/students")}>Students</button>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default Sidebar;
