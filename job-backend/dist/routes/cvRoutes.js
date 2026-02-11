"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const checkJobseeker_1 = require("../middleware/checkJobseeker");
const cvController_1 = require("../controller/cvController");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.use(checkJobseeker_1.checkJobseeker);
router.get("/profile", cvController_1.getCVData);
router.put("/profile", cvController_1.updateCVData);
router.post("/generate", cvController_1.generateCV);
exports.default = router;
