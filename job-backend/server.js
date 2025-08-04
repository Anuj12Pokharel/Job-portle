const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
const authRoutes = require('./routes/authRoutes');


app.use('/api/auth', authRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log(' MongoDB connected');
  
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection failed:', err.message);
});
