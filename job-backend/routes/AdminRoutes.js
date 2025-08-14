const express = require("express");
const { registerAdmin, loginAdmin } = require("../controller/AdminController");
const { protect } = require("../middleware/authMiddleware"); // if needed
const checkAdmin = require("../middleware/checkAdmin");      // if needed

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

module.exports = router; 
