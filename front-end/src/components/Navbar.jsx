import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser,faBell } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar({ handleOptionClick }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const name = localStorage.getItem('fullName');
    setFullName(name);
  }, []);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
  const closeDropdown = () => setDropdownVisible(false);

  const handleClick = (option) => {
    const routes = {
      "Home": "/home",
      "UserProfile": "/profile",
      "BorrowedBooks": "/borrowed",
      "ReturnedBooks": "/returned",
      "Notifications": "/notifications",
    };

    const path = routes[option];

    if (option === "Logout") {
      if (window.confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        navigate("/login");
      }
    } else if (location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
    }

    closeDropdown();
  };

  return (
    <div className="navbar">
      <nav>
        <li>
          <button id="home" onClick={() => handleClick("Home")}>
            <FontAwesomeIcon icon={faHouse} />
          </button>
        </li>
        <h2>Discover Your Next Adventure: Find Your Books Here!</h2>
        <li className="userbutton">
          <button id="user" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faUser} />
          </button>
          {dropdownVisible && (
            <ul className="dropdown-menu">
              <li>
                <button onClick={() => handleClick("UserProfile")}>{fullName}</button>
              </li>
              <li>
                <button onClick={() => handleClick("BorrowedBooks")}>Borrowed Books</button>
              </li>
              <li>
                <button onClick={() => handleClick("ReturnedBooks")}>Returned Books</button>
              </li>
              <li>
                <button onClick={() => handleClick("Notifications")}>Notifications <FontAwesomeIcon icon={faBell} /></button> 
              </li>
              <li>
                <button onClick={() => handleClick("Logout")}>Logout</button>
              </li>
            </ul>
          )}
        </li>
      </nav>
    </div>
  );
}

export default Navbar;
