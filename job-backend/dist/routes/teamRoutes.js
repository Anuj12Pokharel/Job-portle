"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controller/teamController");
const uploadTeam_1 = __importDefault(require("../middleware/uploadTeam"));
const checkAdmin_1 = __importDefault(require("../middleware/checkAdmin"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public route (view by all)
router.get("/get", teamController_1.getTeamMembers);
// SuperAdmin routes
router.post("/add", authMiddleware_1.protect, checkAdmin_1.default, uploadTeam_1.default.single("image"), teamController_1.addTeamMember);
router.put("/update/:id", authMiddleware_1.protect, checkAdmin_1.default, uploadTeam_1.default.single("image"), teamController_1.updateTeamMember);
router.delete("/delete/:id", authMiddleware_1.protect, checkAdmin_1.default, teamController_1.deleteTeamMember);
exports.default = router;
