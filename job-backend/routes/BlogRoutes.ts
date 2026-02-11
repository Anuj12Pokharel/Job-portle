import express from "express";
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "../controller/BlogController";
import { protect } from "../middleware/authMiddleware";
import checkAdmin from "../middleware/checkAdmin";
import { uploadBlogImage } from "../middleware/blogs";




const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", protect, checkAdmin, uploadBlogImage.single("image"), createBlog);
router.put("/update/:id", protect, checkAdmin, uploadBlogImage.single("image"), updateBlog);
router.delete("/delete/:id", protect, checkAdmin, deleteBlog);


export default router;
