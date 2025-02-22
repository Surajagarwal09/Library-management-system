import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";
import "./Borrowedpage.css";

function BorrowedBooks({ handleReturnClickProp, handleOptionClick }) {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [returnRequests, setReturnRequests] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchIssuedBooks = async () => {
    try {
      if (!token) {
        throw new Error("Token not found");
      }
      const decodedToken = jwtDecode(token);
      if (!decodedToken.id) {
        throw new Error("User ID not found in token");
      }

      const response = await axios.get(`https://l-backend-ezgi.onrender.com/api/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const books = response.data.data.issuedBooks.map((book) => {
        const today = new Date();
        const returnDate = new Date(book.returnDate);
        const overdueDays = returnDate < today ? Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24)) : 0;
        return { ...book, fine: overdueDays > 0 ? overdueDays * 2 : book.fine || 0 };
      });

      setIssuedBooks(books);
      console.log(books);

      const returnRequestsData = response.data.data.returnRequests.reduce((acc, request) => {
        acc[request.bookId] = true;
        return acc;
      }, {});
      setReturnRequests(returnRequestsData);
    } catch (error) {
      console.error("Error fetching issued books!", error);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, [token]);

  const handleBookDetailsClick = (bookId) => {
    navigate(`/details/${bookId}`);
  };

  const handleReturnClickLocal = async (book) => {
    if (window.confirm(`Are you sure you want to send a return request for the book titled "${book.bookTitle}"?`)) {
      try {
        setReturnRequests((prevState) => ({ ...prevState, [book.bookId]: true }));
        const response = await axios.post(
          `https://l-backend-ezgi.onrender.com/api/requests/return`,
          { bookId: book.bookId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Return request created:", response.data);
        fetchIssuedBooks();
      } catch (error) {
        console.error("Error sending return request:", error);
        setReturnRequests((prevState) => ({ ...prevState, [book.bookId]: false }));
      }
    } else {
      console.log("Return request cancelled by user.");
    }
  };

  return (
    <div className="borrowed-books-wrapper">
      <Navbar handleBackToList={handleOptionClick} handleOptionClick={handleOptionClick} />
      <br />
      <br />
      <div className="borrowed-books-container">
        <h1>Borrowed Books</h1>
        <br />
        {issuedBooks.length === 0 ? (
          <div className="no-borrowed-books">
            <p>No borrowed books</p>
          </div>
        ) : (
            <>
          <div className="return">
          <h2>Remember To Return Books On Time</h2>
        </div>
          <ul className="borrowed-books-list">
            {issuedBooks.map((book, index) => (
              <li key={index} className="borrowed-book-item">
                <div className="borrowed-book-details">
                  <h2>{book.bookTitle}</h2>
                  <div className="flex">
                    <p>
                      <strong>Issued Date:</strong> {new Date(book.issuedDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Return Date:</strong> {book.returnDate ? new Date(book.returnDate).toLocaleDateString() : "Not returned yet"}
                    </p>
                    <p className={book.fine > 0 ? "red-text" : ""}>
                      <strong>Fine:</strong> ₹{book.fine}
                    </p>
                  </div>
                  <div className="button-container">
                    <button id="return-button" onClick={() => handleReturnClickLocal(book)} disabled={returnRequests[book.bookId]}>
                      {returnRequests[book.bookId] ? "Request Sent" : "Return"}
                    </button>
                    <button onClick={() => handleBookDetailsClick(book.bookId)}>Book Details</button>
                  </div>
                </div>
              </li>
            ))}
              </ul>
              </>
        )}
      </div>
    </div>
  );
}

export default BorrowedBooks;
