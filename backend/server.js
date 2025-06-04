require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Database connection module

const app = express();
const PORT = process.env.PORT || 5001; // Default to 5001 if not specified in .env

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Basic Welcome Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Senior Service Management Application API!' });
});

// TODO: Add other routes here (e.g., for clients, tasks, users)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  // The db.js module already attempts a connection and logs it.
  // You can add a specific check here if needed, for example, to ensure the pool is ready before accepting requests.
  // Example: Check if db object and query method exist
  if (db && db.query) {
    console.log('Database module loaded and query function is available.');
  } else {
    console.error('Database module failed to load correctly.');
  }
});

module.exports = app; // For potential testing