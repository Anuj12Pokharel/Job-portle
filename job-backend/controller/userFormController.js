
const Userform = require('../models/Userform');

const submitForm = async (req, res) => {
  try {
    const { fullName, designation, email, contact, field, employmentStatus } = req.body;
    const resumePath = req.file ? req.file.path : '';

    const form = new Userform({
      fullName,
      designation,
      email,
      contact,
      field,
      employmentStatus,
      resume: resumePath
    });

    await form.save();
    res.status(201).json({ message: 'Form submitted successfully', form });
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { submitForm };
