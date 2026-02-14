"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientLogoController_1 = require("../controller/clientLogoController");
const uploadLogo_1 = __importDefault(require("../middleware/uploadLogo"));
const checkAdmin_1 = __importDefault(require("../middleware/checkAdmin"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public route to get logos
router.get("/get", clientLogoController_1.getLogos);
// Protected routes
router.post("/add", authMiddleware_1.protect, checkAdmin_1.default, uploadLogo_1.default.single("logo"), clientLogoController_1.addLogo);
router.delete("/delete/:id", authMiddleware_1.protect, checkAdmin_1.default, clientLogoController_1.deleteLogo);
exports.default = router;
