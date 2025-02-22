import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import "./Notification.css";

const Notifications = ({ handleOptionClick }) => {
  const [notifications, setNotifications] = useState([]);
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
  
        let fetchedNotifications = response.data.data.notifications || [];

        fetchedNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        setNotifications(fetchedNotifications);
        console.log("Fetched and sorted notifications: ", fetchedNotifications);
      } catch (error) {
        console.error("There was an error fetching user details!", error);
      }
    };
  
    fetchUserDetails();
  }, [token]);
  

  return (
    <div>
      <Navbar handleOptionClick={handleOptionClick} />
      <br />
      <br />
      <br />
      <div className="page-wrapper">
        <div className="notification-page-wrapper">
          <div className="notification-content">
            <h1>Your Notifications <FontAwesomeIcon icon={faBell}/></h1>
            <div className="notifications-container">
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map((notification, index) => (
                    <li key={index}>
                      <div className="noti-time">
                        <p> {new Date(notification.date).toLocaleString()}</p>
                      </div>
                      <h2> Book Title: {notification.bookTitle}</h2>
                      <div className="notif-flex">
                        <p>Fine: {notification.fine} </p>
                        <p>
                          {" "}
                          Return Date:{" "}
                          {new Date(
                            notification.returnDate
                          ).toLocaleDateString()}{" "}
                        </p>
                      </div>
                      <p>{notification.message}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
