"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BlogController_1 = require("../controller/BlogController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const checkAdmin_1 = __importDefault(require("../middleware/checkAdmin"));
const blogs_1 = require("../middleware/blogs");
const router = express_1.default.Router();
router.get("/", BlogController_1.getBlogs);
router.get("/:id", BlogController_1.getBlogById);
router.post("/", authMiddleware_1.protect, checkAdmin_1.default, blogs_1.uploadBlogImage.single("image"), BlogController_1.createBlog);
router.put("/update/:id", authMiddleware_1.protect, checkAdmin_1.default, blogs_1.uploadBlogImage.single("image"), BlogController_1.updateBlog);
router.delete("/delete/:id", authMiddleware_1.protect, checkAdmin_1.default, BlogController_1.deleteBlog);
exports.default = router;
