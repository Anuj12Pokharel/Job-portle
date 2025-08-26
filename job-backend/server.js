const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userFormRoutes = require('./routes/userFormRoutes');
const jobRoutes = require('./routes/jobRoutes');
const AdminRoutes = require('./routes/AdminRoutes');
const contactRoutes = require('./routes/contactRoutes')

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Job Backend API" });
});




app.use('/api/auth', authRoutes);
app.use('/api/form', userFormRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/Contact',contactRoutes);




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
