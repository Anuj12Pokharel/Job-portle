const express = require('express');
const router = express.Router();
const { createContact } = require('../controller/ContactController');
 

// Any authenticated user can post
router.post('/',  createContact);

module.exports = router;
