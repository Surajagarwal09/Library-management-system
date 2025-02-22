import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./CSS/Requests.css";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("https://l-backend-ezgi.onrender.com/api/requests");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const response = await axios.post(`https://l-backend-ezgi.onrender.com/api/requests/accept/${requestId}`);
      setRequests(requests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await axios.post(`https://l-backend-ezgi.onrender.com/api/requests/reject/${requestId}`);
      setRequests(requests.filter(request => request._id !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="requests-wrapper">
      <Sidebar />
      <div className="content">
        <h1>Book Requests</h1>
        <ul className="request-list">
          {requests.map((request) => (
            <li key={request._id} className="request-item">
              <div className="request-details">
                <h2><strong>Book Title:</strong> {request.bookTitle}</h2>
                <div className="bor-req">
                <p><strong>Requested By:</strong> {request.requestedBy}</p>
                  <p><strong>Requested Date:</strong> {new Date(request.requestedDate).toLocaleDateString()}</p>
                  </div>
              </div>
              <div className="request-actions">
                <button onClick={() => handleAccept(request._id)}>Accept</button>
                <button onClick={() => handleReject(request._id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Requests;
