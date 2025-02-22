import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMaximize } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";
import "./Bookdetails.css";

function BookDetails({ toggleDropdown, dropdownVisible, handleOptionClick }) {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [userId, setUserId] = useState(null);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [showPdf, setShowPdf] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);

      const fetchIssuedBooks = async () => {
        try {
          const response = await axios.get(
            `https://l-backend-ezgi.onrender.com/api/users/details`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setIssuedBooks(response.data.data.issuedBooks);
        } catch (error) {
          console.error("Error fetching issued books!", error);
        }
      };

      fetchIssuedBooks();
    }

    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `https://l-backend-ezgi.onrender.com/api/books/${bookId}`
        );
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details!", error);
      }
    };

    const fetchRequestStatus = async () => {
      try {
        const response = await axios.get(
          `https://l-backend-ezgi.onrender.com/api/requests/status/${bookId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequestStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching request status!", error);
      }
    };

    fetchBookDetails();
    if (token) {
      fetchRequestStatus();
    }
  }, [bookId]);

  const handleRequestClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to request the book titled "${book.title}"?`
      )
    ) {
      try {
        const response = await axios.post(
          `https://l-backend-ezgi.onrender.com/api/requests`,
          { bookId, bookTitle: book.title },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequestStatus(response.data.status);
        alert(`Book requested: ${book.title}`);
      } catch (error) {
        console.error("Error requesting the book!", error);
      }
    }
  };

  const handleShowPdfClick = () => {
    setShowPdf((prevShowPdf) => !prevShowPdf);
  };

  const handleFullscreen = () => {
    if (pdfRef.current) {
      if (pdfRef.current.requestFullscreen) {
        pdfRef.current.requestFullscreen();
      } else if (pdfRef.current.mozRequestFullScreen) {
        pdfRef.current.mozRequestFullScreen();
      } else if (pdfRef.current.webkitRequestFullscreen) {
        pdfRef.current.webkitRequestFullscreen();
      } else if (pdfRef.current.msRequestFullscreen) {
        pdfRef.current.msRequestFullscreen();
      }
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  const isBookBorrowed = issuedBooks.some(
    (issuedBook) => issuedBook.bookId === bookId
  );

  return (
    <div className="book-details-wrapper">
      <Navbar
        handleBackToList={() => navigate("/home")}
        toggleDropdown={toggleDropdown}
        dropdownVisible={dropdownVisible}
        handleOptionClick={handleOptionClick}
      />
      <br />
      <br />
      <br />
      <br />
      <br />

      <div className="book-details">
        <div className="book-cover">
          {/* <img src={book.img} alt={book.title} /> */}
        </div>
        <div className="book-info">
          <h2>{book.title}</h2>
          <br />
          <h3>{book.description}</h3>
          <br />
          <p>Genre: {book.genre}</p>
          <p>Author: {book.author}</p>
          <p>Year: {book.year}</p>

          <div className="book-details-buttons">
            {isBookBorrowed ? (
              <button type="button" disabled>
                Book Borrowed
              </button>
            ) : (
              <>
                {requestStatus === "Pending" && (
                  <button type="button" disabled>
                    Book Requested
                  </button>
                )}
                {requestStatus === "Accepted" && (
                  <button type="button">Book is now available</button>
                )}
                {requestStatus === "Rejected" && (
                  <button type="button" onClick={handleRequestClick}>
                    Request Book
                  </button>
                )}
                {!requestStatus && (
                  <button type="button" onClick={handleRequestClick}>
                    Request Book
                  </button>
                )}
              </>
            )}
            {book.ebookPath && (
              <button
                type="button"
                onClick={handleShowPdfClick}
                disabled={!isBookBorrowed}
              >
                {showPdf
                  ? "Close E-Book"
                  : isBookBorrowed
                  ? "View E-Book"
                  : "Borrow to View eBook PDF"}
              </button>
            )}
          </div>

          {showPdf && book.ebookPath && (
            <div className="pdf-viewer-container">
              <button id="pdfbutton" onClick={handleFullscreen}>
                <FontAwesomeIcon icon={faMaximize} />
                &nbsp;Fullscreen
              </button>
              <iframe
                ref={pdfRef}
                src={`https://l-backend-ezgi.onrender.com/${book.ebookPath}#toolbar=0&navpanes=0&scrollbar=0`}
                title="eBook PDF"
                onContextMenu={(e) => e.preventDefault()}
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
