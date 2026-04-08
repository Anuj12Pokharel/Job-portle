import Blog from "../models/Blogmodel";
import { Request, Response } from "express";

// Get all blogs with pagination
export const getBlogs = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 100;
  const skip = (page - 1) * limit;

  try {
    const totalBlogs = await Blog.countDocuments(); // Get total count
    const blogs = await Blog.find().skip(skip).limit(limit);

    // Ensure image paths are correctly formatted and all fields (including timestamps) are preserved
    const blogsWithNormalizedImages = blogs.map(blog => {
      const b = blog.toObject();
      if (b.image && !b.image.startsWith('uploads/')) {
        b.image = `uploads/blogs/${b.image}`;
      }
      return b;
    });

    res.json({
      totalBlogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      blogs: blogsWithNormalizedImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single blog by ID
export const getBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Convert image filename to relative path if needed
    const b = blog.toObject();
    if (b.image && !b.image.startsWith('uploads/')) {
      b.image = `uploads/blogs/${b.image}`;
    }

    res.json(b);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create blog (only superadmin)
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, body, author, date } = req.body;
    const image = req.file ? req.file.filename : null;

    const newBlog = new Blog({ title, body, author, image, date: date || Date.now() });
    await newBlog.save();

    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
import fs from "fs";
import path from "path";

// Update blog
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, body, author, date } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // delete old image if new uploaded
    if (req.file && blog.image) {
      // Check if image path is a full URL or relative path
      // If it's just a filename, we can try to delete it from uploads/blogs
      // The getBlogs method constructs full URLs, but the DB stores filenames usually.
      // Let's check what's stored. createBlog stores 'req.file.filename'.
      const oldImagePath = path.join(__dirname, '../../uploads/blogs', blog.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      blog.image = req.file.filename;
    }

    if (title) blog.title = title;
    if (body) blog.body = body;
    if (author) blog.author = author;
    if (date) blog.date = date;

    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete blog (only superadmin)
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Delete image if exists
    if (blog.image) {
      const imagePath = path.join(__dirname, '../../uploads/blogs', blog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
