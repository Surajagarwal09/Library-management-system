import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../components/Loginpage.css";
function Loginpage() {
  const [userType, setUserType] = useState("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://l-backend-ezgi.onrender.com/api/auth/login",
        { userType, id, password }
      );
      if (response.data.data.token) {
        const token = response.data.data.token;
        const fullName = response.data.data.name;
        localStorage.setItem("token", token);
        localStorage.setItem("fullName", fullName);
        localStorage.setItem("userType", userType);
        if (userType === "admin") {
          navigate("/adminhome");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      alert("User not found. Please register to access your account.");
    }
  };

  const handleRegister = () => {
    if (userType === "student") {
      navigate("/studentregister");
    } else if (userType === "staff") {
      navigate("/staffregister");
    } else if (userType === "admin") {
      navigate("/adminregister");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div>
        <h1 className="head">Access Your Library</h1>
      </div>

      <div className="UserType">
        <button
          className={userType === "student" ? "active" : ""}
          onClick={() => setUserType("student")}
        >
          Student
        </button>
        <button
          className={userType === "staff" ? "active" : ""}
          onClick={() => setUserType("staff")}
        >
          Staff
        </button>
        <button
          className={userType === "admin" ? "active" : ""}
          onClick={() => setUserType("admin")}
        >
          Admin
        </button>
      </div>

      {userType === "student" && (
        <div className="Student">
          <h1>Student Login</h1>
          <div className="form">
            <form onSubmit={handleLogin}>
              <label htmlFor="stdid">Student ID: </label>
              <input
                id="stdid"
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <br />
              <label htmlFor="stdpassword">Password: </label>
              <input
                id="stdpassword"
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <button id="stdsubmit" type="submit">
                Login
              </button>
              <br />
              <button id="register" type="button" onClick={handleRegister}>
                New user? Get started with registration.
              </button>
            </form>
          </div>
        </div>
      )}
      {userType === "staff" && (
        <div className="Staff">
          <h1>Staff Login</h1>
          <div className="form">
            <form onSubmit={handleLogin}>
              <label htmlFor="stfid">Staff ID: </label>
              <input
                id="stfid"
                type="text"
                placeholder="ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <br />
              <label htmlFor="stfpassword">Password: </label>
              <input
                id="stfpassword"
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <button id="stfsubmit" type="submit">
                Login
              </button>
              <br />
              <button id="stfregister" type="button" onClick={handleRegister}>
                New user? Get started with registration.
              </button>
            </form>
          </div>
        </div>
      )}
      {userType === "admin" && (
        <div className="Admin">
          <h1>Admin Login</h1>
          <div className="form">
            <form onSubmit={handleLogin}>
              <label htmlFor="adminid">Admin Id: </label>
              <input
                id="adminid"
                type="text"
                placeholder="Email"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />{" "}
              <br />
              <label htmlFor="adminpassword">Password: </label>
              <input
                id="adminpassword"
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
              <button id="admsubmit" type="submit">
                Login
              </button>
              <br />
              <button id="stfregister" type="button" onClick={handleRegister}>
                New user? Get started with registration.
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Loginpage;
