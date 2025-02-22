import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./ReturnedBooks.css";

function ReturnedBooks({ handleOptionClick }) {
  const [returnedBooks, setReturnedBooks] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!token) {
          throw new Error("Token not found");
        }
        const decodedToken = jwtDecode(token);
        if (!decodedToken.id) {
          throw new Error("User ID not found in token");
        }
        const response = await axios.get(
          `https://l-backend-ezgi.onrender.com/api/users/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        let fetchedBooks = response.data.data.returnedBooks || [];
        fetchedBooks.sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));
  
        setReturnedBooks(fetchedBooks);
        console.log("Fetched and sorted returned books: ", fetchedBooks);
      } catch (error) {
        console.error("There was an error fetching user details!", error);
      }
    };
  
    fetchUserDetails();
  }, [token]);
  

  return (
    <div className="returned-books-wrapper">
      <Navbar
        handleBackToList={handleOptionClick}
        handleOptionClick={handleOptionClick}
      />
      <br />
      <br />
      <br />
      <div className="returned-content">
        <h1>Returned Books</h1>
        <ul className="returned-books-list">
          {returnedBooks.map((book, index) => (
            <li key={index} className="returned-book-item">
              <div className="returned-book-details">
                <h2>
                  <strong></strong> {book.bookTitle}
                </h2>
                <br />
                <br />
                <div className="p-flex">
                  <p>
                    <strong>Issued Date:</strong>{" "}
                    {new Date(book.issuedDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Returned Date:</strong>{" "}
                    {new Date(book.returnDate).toLocaleDateString()}
                  </p>
                  <h4>
                    <strong>Fine Paid:</strong> {book.fine}
                  </h4>
                </div>
                <div className="button">
                  <button onClick={() => navigate(`/details/${book.bookId}`)}>
                    Book Details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ReturnedBooks;
