// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const app = express();


app.use(express.json());

// Define a simple route using an env variable
app.get('/', (req, res) => {
  const message = process.env.GREETING_MESSAGE || "Hello, World!";
  res.send(message);
});

// Get the port from environment or default to 3000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
