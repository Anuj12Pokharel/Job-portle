const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyName: String,
  logo: String, 
  position: String,
  category: String,
  location: String,
  jobLevel: String,
  salary: String,
  educationLevel: String,
  desiredCandidate: String,
  experience: String,
  expiryDate: Date,
  description: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
