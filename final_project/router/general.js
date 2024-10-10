const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// Get the book list available in the shop
public_users.get('/', (req, res) => {
  res.send(JSON.stringify(books, null, 2));  // Neatly formatted JSON
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
      res.send(JSON.stringify(book, null, 2));
  } else {
      res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
      res.send(JSON.stringify(booksByAuthor, null, 2));
  } else {
      res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);

  if (booksByTitle.length > 0) {
      res.send(JSON.stringify(booksByTitle, null, 2));
  } else {
      res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
      res.send(JSON.stringify(book.reviews, null, 2));
  } else {
      res.status(404).json({ message: "No reviews found for this ISBN" });
  }
});

public_users.get('/async-books', async (req, res) => {
  try {
      const response = await axios.get('http://localhost:5000/');  // Using axios
      res.send(JSON.stringify(response.data, null, 2));
  } catch (error) {
      res.status(500).json({ message: "Error fetching books" });
  }
});

public_users.get('/async-isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  
  try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      res.send(JSON.stringify(response.data, null, 2));
  } catch (error) {
      res.status(500).json({ message: "Error fetching book details" });
  }
});

public_users.get('/async-author/:author', async (req, res) => {
  const author = req.params.author;

  try {
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      res.send(JSON.stringify(response.data, null, 2));
  } catch (error) {
      res.status(500).json({ message: "Error fetching books by author" });
  }
});

public_users.get('/async-title/:title', async (req, res) => {
  const title = req.params.title;

  try {
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      res.send(JSON.stringify(response.data, null, 2));
  } catch (error) {
      res.status(500).json({ message: "Error fetching books by title" });
  }
});


module.exports.general = public_users;
