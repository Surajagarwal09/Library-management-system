import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Booklist from "./Booklist";
import "./Homepage.css";

function Homepage() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionClick = () => {
    setDropdownVisible(false);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter((g) => g !== genre)
        : [...prevSelectedGenres, genre]
    );
  };

  const handleLearnMoreClick = (book) => {
    navigate(`/details/${encodeURIComponent(book.title)}`);
  };
  return (
    <div className="homepage-wrapper">
      <Navbar
        handleBackToList={() => navigate("/")}
        toggleDropdown={toggleDropdown}
        dropdownVisible={dropdownVisible}
        handleOptionClick={handleOptionClick}
      />
      <Booklist
        handleLearnMoreClick={handleLearnMoreClick}
        handleGenreChange={handleGenreChange}
        selectedGenres={selectedGenres}
      />
    </div>
  );
}

export default Homepage;
