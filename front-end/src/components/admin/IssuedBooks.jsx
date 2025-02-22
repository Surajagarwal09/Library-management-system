import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./CSS/Issued.css";

function Issued() {
  const [issuedBooks, setIssuedBooks] = useState([]);

  const fetchIssuedBooks = async () => {
    try {
      const studentResponse = await axios.get(
        "https://l-backend-ezgi.onrender.com/api/student"
      );
      const staffResponse = await axios.get("https://l-backend-ezgi.onrender.com/api/staff");

      const studentBooks = studentResponse.data.flatMap((student) =>
        student.issuedBooks.map((book) => ({
          ...book,
          issuedTo: `ID: ${student.id} (Student)`,
          userId: student.id,
          userType: "Student",
          returnRequests: student.returnRequests || [],
        }))
      );

      const staffBooks = staffResponse.data.flatMap((staff) =>
        staff.issuedBooks.map((book) => ({
          ...book,
          issuedTo: `ID: ${staff.id} (Staff)`,
          userId: staff.id,
          userType: "Staff",
          returnRequests: staff.returnRequests || [],
        }))
      );

      setIssuedBooks([...studentBooks, ...staffBooks]);
    } catch (error) {
      console.error("Error fetching issued books:", error);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const handleAcceptReturn = async (requestId, userId, bookTitle) => {
    if (
      window.confirm(
        `Are you sure you want to accept the return request for the book titled "${bookTitle}"?`
      )
    ) {
      try {
        const response = await axios.post(
          `https://l-backend-ezgi.onrender.com/api/requests/return/accept/${requestId}`
        );
        console.log("Return request accepted:", response.data);
        window.alert(
          `Return request accepted!\nUser ID: ${userId}\nBook Title: ${bookTitle}`
        );
        fetchIssuedBooks();
      } catch (error) {
        console.error("Error accepting return request:", error);
      }
    } else {
      console.log("Return request cancelled by user.");
    }
  };

  const handleSendMessage = async (
    userId,
    userType,
    bookId,
    bookTitle,
    returnDate,
    fine
  ) => {
    const message = window.prompt(
      `Enter the message to send to the user with the following details:\n\nBook Title: ${bookTitle}\nReturn Date: ${new Date(
        returnDate
      ).toLocaleDateString()}\nFine: ₹${fine}\n\nMessage:`
    );
    if (message) {
      try {
        const response = await axios.post(
          `https://l-backend-ezgi.onrender.com/api/notifications/send`,
          {
            userId,
            userType,
            bookId,
            bookTitle,
            returnDate,
            fine,
            message,
          }
        );
        console.log("Message sent:", response.data);
        window.alert("Message sent successfully!");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="issued-wrapper">
      <Sidebar />
      <div className="content">
        <h1>Issued Books</h1>
        <ul className="issued-list">
          {issuedBooks.map((book, index) => {
            const matchingRequest = book.returnRequests.find(
              (request) => request.bookId === book.bookId
            );
            return (
              <li key={index} className="issued-item">
                <div className="book-details">
                  <h2>
                    <strong>Title:</strong> {book.bookTitle}
                  </h2>
                  <div className="issued-flex">
                    <p>
                      <strong>Issued To:</strong> {book.issuedTo}
                    </p>
                    <p>
                      <strong>Issued Date:</strong>{" "}
                      {new Date(book.issuedDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Return Date:</strong>{" "}
                      {new Date(book.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="fine-flex">
                    <p className={book.fine > 0 ? "red-text" : ""}>
                      <strong>Fine:</strong> ₹{book.fine || 0}
                    </p>
                    {matchingRequest && (
                      <button
                        onClick={() =>
                          handleAcceptReturn(
                            matchingRequest._id,
                            book.userId,
                            book.bookTitle
                          )
                        }
                      >
                        Accept Return
                      </button>
                    )}
                    <button
                      onClick={() =>
                        handleSendMessage(
                          book.userId,
                          book.userType,
                          book.bookId,
                          book.bookTitle,
                          book.returnDate,
                          book.fine
                        )
                      }
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Issued;
