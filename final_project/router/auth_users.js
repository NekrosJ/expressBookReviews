const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" },
  { username: "user3", password: "password3" },
  { username: "user4", password: "password4" },
  { username: "user5", password: "password5" }
];


// Function to validate if a username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Function to authenticate a user based on username and password
const authenticatedUser = (username, password) => {
  return users.find(user => user.username === username && user.password === password);
};

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
      return res.status(400).json({ message: "User already exists" });
  }

  // Add the new user to the users array
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// Only registered users can log in
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = authenticatedUser(username, password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const accessToken = jwt.sign({ username }, 'fingerprint_customer', { expiresIn: '1h' });

  // Save token in session
  req.session.authorization = { accessToken };
  
  res.status(200).json({ message: "Login successful", accessToken });
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Add or update the review
  books[isbn].reviews[username] = review;

  res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
