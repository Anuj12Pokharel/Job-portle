import Blog from "../models/Blogmodel";

// Get all blogs with pagination
export const getBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find().skip(skip).limit(limit);
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create blog (only superadmin)
export const createBlog = async (req, res) => {
  try {
    const { title, body, author } = req.body;
    const image = req.file ? req.file.filename : null;

    const newBlog = new Blog({ title, body, author, image });
    await newBlog.save();

    res.status(201).json(newBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

