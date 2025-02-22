import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Booklist.css";

function Booklist({ handleGenreChange, selectedGenres = [] }) {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const genres = [
    "Adventure",
    "Classic",
    "Dystopian",
    "Fantasy",
    "Historical",
    "Horror",
    "Mystery",
    "Novel",
    "Political fiction",
    "Romance",
    "Sci-fi",
    "Thriller",
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("https://l-backend-ezgi.onrender.com/api/books/");
        const data = await response.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        // console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    // Check if the search query is empty
    if (!searchQuery.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `https://l-backend-ezgi.onrender.com/api/books/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );

      if (!response.ok) {
        // const errorData = await response.json();
        // console.error("Search failed:", errorData);
        setBooks([]);
        return;
      }

      const data = await response.json();
      // console.log("Searched books from backend:", data);
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      // console.error("Failed to search books:", error);
      setBooks([]);
    }
  };

  const filteredBooks =
    selectedGenres.length === 0
      ? books
      : books.filter((book) =>
          selectedGenres.some((genre) =>
            book.genre.toLowerCase().includes(genre.toLowerCase())
          )
        );

  return (
    <div className="main-content">
      <div className="book-list-container">
        <form onSubmit={handleSearch}>
          <div className="searchbar">
            <input
              id="search"
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
        <div className="container">
          {Array.isArray(filteredBooks) && filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book._id} className="col-sm-4">
                <div className="card">
                  <div className="card-body">
                    <h5>{book.title}</h5>
                    <p>Genre: {book.genre}</p>
                    <p>Author: {book.author}</p>
                    <p>Year: {book.year}</p>
                    <button onClick={() => navigate(`/details/${book._id}`)}>
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h1>Book not found</h1>
            </div>
          )}
        </div>
      </div>
      <div className="filter-section">
        <h3>Filter by Genre</h3>
        <ul>
          {genres.map((genre) => (
            <li key={genre}>
              <label htmlFor={genre}>
                <input
                  type="checkbox"
                  id={genre}
                  value={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                />
                {genre}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Booklist;
