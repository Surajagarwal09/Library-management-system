import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/Registeration.css";

function Staffregister() {
  const [formData, setFormData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    phoneno: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://l-backend-ezgi.onrender.com/api/staff/register", formData);
      if (response.data.token) {
        navigate("/login");
      }
    } catch (error) {
      console.error("There was an error registering the staff!", error);
    }
  };

  return (
    <div className="staff-register-wrapper">
      <h1 className="head1">Staff Registration</h1>
      <div className="sform">
        <form onSubmit={handleSubmit}>
          <label>Staff ID:</label>
          <br />
          <input
            id="staffid"
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
          />
          <br />
          <label>First Name:</label>
          <br />
          <input
            id="fname"
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
          <br />
          <label>Last Name:</label>
          <br />
          <input
            id="lname"
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
          <br />
          <label>Phone No:</label>
          <br />
          <input
            id="phoneno"
            type="number"
            name="phoneno"
            value={formData.phoneno}
            onChange={handleChange}
          />
          <br />
          <label>Email:</label>
          <br />
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <label>Password:</label>
          <br />
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <br />
          <label>Confirm Password:</label>
          <br />
          <input
            id="confirmpass"
            type="password"
            name="confirmpassword"
            value={formData.confirmpassword}
            onChange={handleChange}
          />
          <br />
          <button id="stsubmit" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Staffregister;
