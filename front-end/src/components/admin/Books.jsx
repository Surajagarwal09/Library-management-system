import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./CSS/Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://l-backend-ezgi.onrender.com/api/books/");
        const data = await response.json();
        
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://l-backend-ezgi.onrender.com/api/books/search?query=${searchQuery}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to search books:", error);
    }
  };

  return (
    <div className="unique-wrapper">
      <Sidebar />
      <div className="unique-main-content">
        <div className="unique-book-list-container">
        <form onSubmit={handleSearch}>
            <div className="admin-searchbar">
              <input
                id="admin-search"
                type="search"
                placeholder="Find books you love"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form>
          <h2>Books Available In The Library</h2>
          <div className="unique-container">
            {books.map((book) => (
              <div key={book._id} className="unique-col-sm-4">
                <div className="unique-card">
                  {/* <img src={book.img} alt={book.title} /> */}
                  <div className="unique-card-body">
                    <h5>{book.title}</h5>
                    <p>Genre: {book.genre}</p>
                    <p>Author: {book.author}</p>
                    <p>Year: {book.year}</p>
                    <button onClick={() => navigate(`/admin/details/${book._id}`)}>
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Books;
