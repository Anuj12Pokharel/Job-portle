"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bannerController_1 = require("../controller/bannerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const checkAdmin_1 = __importDefault(require("../middleware/checkAdmin"));
const uploadBanner_1 = __importDefault(require("../middleware/uploadBanner"));
const router = express_1.default.Router();
router.get("/", bannerController_1.getBanners);
router.get("/:type", bannerController_1.getBannerByType);
router.post("/", authMiddleware_1.protect, checkAdmin_1.default, uploadBanner_1.default.single("backgroundImage"), bannerController_1.upsertBanner);
router.delete("/:id", authMiddleware_1.protect, checkAdmin_1.default, bannerController_1.deleteBanner);
exports.default = router;
