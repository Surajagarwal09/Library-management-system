import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMaximize } from "@fortawesome/free-solid-svg-icons";
import "./CSS/AdminBookDetails.css";

function AdminBookDetails() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `https://l-backend-ezgi.onrender.com/api/books/${bookId}`
        );
        setBook(response.data);
      } catch (error) {
        console.error("There was an error fetching book details!", error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleDeleteClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`https://l-backend-ezgi.onrender.com/api/books/delete/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Book deleted: ${book.title}`);
      navigate("/books");
    } catch (error) {
      console.error("There was an error deleting the book!", error);
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

  return (
    <div className="admin-book-details-wrapper">
      <Sidebar />
      <div>
        <div className="admin-book-details">
          <div className="admin-book-cover">
            {/* <img src={book.img} alt={book.title} /> */}
          </div>
          <div className="admin-book-info">
            <h2>{book.title}</h2>
            <br />
            <h3>{book.description}</h3>
            <br />
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Year: {book.year}</p>
            <button onClick={handleDeleteClick} className="delete-button">
              Delete Book
            </button>
            {book.ebookPath && (
              <button id="view-pdf" type="button" onClick={handleShowPdfClick}>
                {showPdf ? "Close E-Book" : "View E-Book"}
              </button>
            )}

            {showPdf && book.ebookPath && (
              <div className="admin-pdf-viewer-container">
                <button id="admin-pdfbutton" onClick={handleFullscreen}>
                  <FontAwesomeIcon icon={faMaximize} />
                  &nbsp;View Fullscreen
                </button>
                <iframe
                  ref={pdfRef}
                  src={`https://l-backend-ezgi.onrender.com/${book.ebookPath}`}
                  title="eBook PDF"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBookDetails;
