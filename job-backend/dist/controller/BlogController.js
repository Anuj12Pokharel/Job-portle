"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlog = exports.getBlogById = exports.getBlogs = void 0;
const Blogmodel_1 = __importDefault(require("../models/Blogmodel"));
// Get all blogs with pagination
const getBlogs = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    try {
        const blogs = await Blogmodel_1.default.find().skip(skip).limit(limit);
        res.json(blogs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getBlogs = getBlogs;
// Get single blog by ID
const getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blogmodel_1.default.findById(id);
        if (!blog)
            return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getBlogById = getBlogById;
// Create blog (only superadmin)
const createBlog = async (req, res) => {
    try {
        const { title, body, author } = req.body;
        const image = req.file ? req.file.filename : null;
        const newBlog = new Blogmodel_1.default({ title, body, author, image });
        await newBlog.save();
        res.status(201).json(newBlog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createBlog = createBlog;
// export const updateBlog = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, body, author } = req.body;
//     const blog = await Blog.findById(id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });
//     // delete old image if new uploaded
//     if (req.file && blog.image) {
//       const oldImagePath = path.resolve(blog.image);
//       if (fs.existsSync(oldImagePath)) {
//         fs.unlinkSync(oldImagePath);
//       }
//       blog.image = `uploads/blog/${req.file.filename}`;
//     }
//     blog.title = title ?? blog.title;
//     blog.body = body ?? blog.body;
//     blog.author = author ?? blog.author;
//     await blog.save();
//     res.status(200).json(blog);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// // Delete blog (only superadmin)
// export const deleteBlog = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const blog = await Blog.findById(id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });
//     // Delete image if exists
//     if (blog.image) {
//       const imagePath = path.resolve(blog.image);
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }
//     await Blog.findByIdAndDelete(id);
//     res.status(200).json({ message: "Blog deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
