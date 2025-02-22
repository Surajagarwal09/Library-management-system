import React, { useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./CSS/Addbooks.css";

const AddBook = ({ fetchBooks }) => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
    description: "",
  });
  const [ebook, setEbook] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleFileChange = (e) => {
    setEbook(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", book.title);
    formData.append("author", book.author);
    formData.append("year", book.year);
    formData.append("genre", book.genre);
    formData.append("description", book.description);
    if (ebook) {
      formData.append("ebook", ebook);
    }

    try {
      const response = await axios.post(
        "https://l-backend-ezgi.onrender.com/api/books/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        alert("Book added successfully!");
        setBook({
          title: "",
          author: "",
          year: "",
          genre: "",
          description: "",
        });
        setEbook(null);
        if (fetchBooks) {
          fetchBooks();
        }
      } else {
        alert("Failed to add book.");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Error adding book.");
    }
  };

  return (
    <div className="add-book-wrapper">
      <Sidebar />
      <div className="add-book-container">
        <h2>Add a New Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={book.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={book.author}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={book.year}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={book.genre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={book.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="ebook">eBook PDF</label>
            <input
              type="file"
              id="ebook"
              name="ebook"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit">Add Book</button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
