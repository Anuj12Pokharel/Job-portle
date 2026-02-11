"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statisticsController_1 = require("../controller/statisticsController");
const router = express_1.default.Router();
router.get("/", statisticsController_1.getStatistics);
router.get("/training", statisticsController_1.getTrainingStatistics);
exports.default = router;
