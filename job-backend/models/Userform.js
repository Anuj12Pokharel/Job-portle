// models/UserForm.js
const mongoose = require('mongoose');

const userformSchema = new mongoose.Schema({
  fullName: String,
  designation: String,
  email: String,
  contact: String,
  field: String,
  employmentStatus: String,
  resume: String, // File path
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Userform', userformSchema);
