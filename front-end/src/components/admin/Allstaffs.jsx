import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./CSS/Allstaffs.css";

function Allstaffs() {
  const [staffs, setStaffs] = useState([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await axios.get("https://l-backend-ezgi.onrender.com/api/staff");
        setStaffs(response.data);
      } catch (error) {
        console.error("Error fetching staffs:", error);
      }
    };

    fetchStaffs();
  }, []);

  const displayStaffs =
    staffs.length % 2 === 1 ? [...staffs, { empty: true }] : staffs;

  return (
    <div className="allstaffs-wrapper">
      <Sidebar />
      <div className="content">
        <h1>All Staffs</h1>
        <ul className="staff-list">
          {displayStaffs.map((staff, index) => (
            <li
              key={index}
              className={`staff-item ${staff.empty ? "empty" : ""}`}
            >
              {!staff.empty ? (
                <>
                  <div className="staff-name">
                    Full Name: {staff.firstname} {staff.lastname}
                  </div>
                  <div className="staff-id">Staff ID: {staff.id}</div>
                  <div className="staff-phone">Phone: {staff.phoneno}</div>
                  <div className="staff-email">Email: {staff.email}</div>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Allstaffs;
