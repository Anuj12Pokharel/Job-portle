"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogById = exports.getBlogs = void 0;
const Blogmodel_1 = __importDefault(require("../models/Blogmodel"));
// Get all blogs with pagination
const getBlogs = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    try {
        const totalBlogs = await Blogmodel_1.default.countDocuments(); // Get total count
        const blogs = await Blogmodel_1.default.find().skip(skip).limit(limit);
        // Convert image filenames to full URLs
        const blogsWithFullImageUrls = blogs.map(blog => {
            if (blog.image) {
                const fullImageUrl = `${req.protocol}://${req.get('host')}/uploads/blogs/${blog.image}`;
                return { ...blog.toObject(), image: fullImageUrl };
            }
            return blog.toObject();
        });
        res.json({
            totalBlogs,
            currentPage: page,
            totalPages: Math.ceil(totalBlogs / limit),
            blogs: blogsWithFullImageUrls,
        });
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
        // Convert image filename to full URL
        if (blog.image) {
            const fullImageUrl = `${req.protocol}://${req.get('host')}/uploads/blogs/${blog.image}`;
            const blogWithFullImageUrl = { ...blog.toObject(), image: fullImageUrl };
            return res.json(blogWithFullImageUrl);
        }
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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Update blog
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, body, author } = req.body;
        const blog = await Blogmodel_1.default.findById(id);
        if (!blog)
            return res.status(404).json({ message: "Blog not found" });
        // delete old image if new uploaded
        if (req.file && blog.image) {
            // Check if image path is a full URL or relative path
            // If it's just a filename, we can try to delete it from uploads/blogs
            // The getBlogs method constructs full URLs, but the DB stores filenames usually.
            // Let's check what's stored. createBlog stores 'req.file.filename'.
            const oldImagePath = path_1.default.join(__dirname, '../../uploads/blogs', blog.image);
            if (fs_1.default.existsSync(oldImagePath)) {
                fs_1.default.unlinkSync(oldImagePath);
            }
            blog.image = req.file.filename;
        }
        if (title)
            blog.title = title;
        if (body)
            blog.body = body;
        if (author)
            blog.author = author;
        await blog.save();
        res.status(200).json(blog);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateBlog = updateBlog;
// Delete blog (only superadmin)
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blogmodel_1.default.findById(id);
        if (!blog)
            return res.status(404).json({ message: "Blog not found" });
        // Delete image if exists
        if (blog.image) {
            const imagePath = path_1.default.join(__dirname, '../../uploads/blogs', blog.image);
            if (fs_1.default.existsSync(imagePath)) {
                fs_1.default.unlinkSync(imagePath);
            }
        }
        await Blogmodel_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Blog deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteBlog = deleteBlog;
