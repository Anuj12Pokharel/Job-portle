"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const talentController_1 = require("../controller/talentController");
const uploadCV_1 = __importDefault(require("../middleware/uploadCV"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const checkAdmin_1 = __importDefault(require("../middleware/checkAdmin"));
const router = express_1.default.Router();
// Public: submit application
router.post("/submit", uploadCV_1.default.single("cv"), talentController_1.submitTalent);
// SuperAdmin: get all submissions
router.get("/all", authMiddleware_1.protect, checkAdmin_1.default, talentController_1.getTalents);
exports.default = router;
