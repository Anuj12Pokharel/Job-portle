import express from "express";
import { getBlogs, getBlogById, createBlog } from "../controller/BlogController";
import { protect } from "../middleware/authMiddleware";
import checkAdmin from "../middleware/checkAdmin";
import upload from "../middleware/upload";




const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", protect, checkAdmin, upload.single("image"), createBlog);

export default router;
