import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";
import "./Profilepage.css";

function UserProfile({ handleOptionClick }) {
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!token) {
          throw new Error("Token not found");
        }
        const decodedToken = jwtDecode(token);
        if (!decodedToken.id || !decodedToken.userType) {
          throw new Error("User ID or User Type not found in token");
        }
        const response = await axios.get(
          `https://l-backend-ezgi.onrender.com/api/users/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.data);
      } catch (error) {
        console.error("There was an error fetching user details!", error);
      }
    };

    fetchUserDetails();
  }, [token]);

  return (
    <div className="profile-wrapper">
      <Navbar
        handleBackToList={handleOptionClick}
        handleOptionClick={handleOptionClick}
      />
      <br />
      <br />
      <div className="profile-container">
        <img
          src={`${process.env.PUBLIC_URL}/assets/default-avatar.png`}
          alt="user img"
        />
        <h1>
          {user.firstname} {user.lastname}
        </h1>
        <div className="profile-details">
          {userType === "student" ? (
            <p>Student ID: {user.id}</p>
          ) : userType === "staff" ? (
            <p>Staff ID: {user.id}</p>
          ) : userType === "admin" ? (
            <p>Admin ID: {user.id}</p>
          ) : (
            <p>ID: {user.id}</p>
          )}
          <p>Phone No: {user.phoneno}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
