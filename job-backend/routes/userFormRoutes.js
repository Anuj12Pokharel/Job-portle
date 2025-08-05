const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { submitForm } = require('../controller/userFormController');
const { protect } = require('../middleware/authMiddleware'); // ✅ import it


router.post('/submit-form', protect, upload.single('resume'), submitForm);

module.exports = router;