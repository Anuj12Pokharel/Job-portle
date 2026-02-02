"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trainingController_1 = require("../controller/trainingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const checkAdmin_1 = __importDefault(require("../middleware/checkAdmin"));
const router = express_1.default.Router();
router.get("/", trainingController_1.getTrainings);
router.post("/", authMiddleware_1.protect, checkAdmin_1.default, trainingController_1.createTraining);
router.put("/update/:id", authMiddleware_1.protect, checkAdmin_1.default, trainingController_1.updateTraining);
router.delete("/delete/:id", authMiddleware_1.protect, checkAdmin_1.default, trainingController_1.deleteTraining);
exports.default = router;
