<<<<<<< HEAD
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContactController_1 = require("../controller/ContactController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const checkAdmin_1 = __importDefault(require("../middleware/checkAdmin"));
const router = (0, express_1.Router)();
router.post("/submit", ContactController_1.createContact);
router.get("/get", authMiddleware_1.protect, checkAdmin_1.default, ContactController_1.getContacts);
exports.default = router;
=======
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContactController_1 = require("../controller/ContactController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const checkAdmin_1 = __importDefault(require("../middleware/checkAdmin"));
const router = (0, express_1.Router)();
router.post("/submit", ContactController_1.createContact);
router.get("/get", authMiddleware_1.protect, checkAdmin_1.default, ContactController_1.getContacts);
exports.default = router;
>>>>>>> origin/updated-feature
