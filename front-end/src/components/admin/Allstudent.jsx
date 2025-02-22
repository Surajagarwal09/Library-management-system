import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./CSS/Allstudents.css";

function Allstudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("https://l-backend-ezgi.onrender.com/api/student");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const displayStudents =
    students.length % 2 === 1 ? [...students, { empty: true }] : students;

  return (
    <div className="allstudents-wrapper">
      <Sidebar />
      <div className="content">
        <h1>All Students</h1>
        <ul className="student-list">
          {displayStudents.map((student, index) => (
            <li
              key={index}
              className={`student-item ${student.empty ? "empty" : ""}`}
            >
              {!student.empty ? (
                <>
                  <div className="student-name">
                    Full Name: {student.firstname} {student.lastname}
                  </div>
                  <div className="student-id">Student ID: {student.id}</div>
                  <div className="student-phone">Phone: {student.phoneno}</div>
                  <div className="student-email">Email: {student.email}</div>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Allstudents;
