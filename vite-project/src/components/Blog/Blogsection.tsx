import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface Blog {
  _id: string;
  title: string;
  body: string;
  author: string;
  image: string;
  date?: string;
  createdAt: string;
}

interface BlogsectionProps {
  currentPage: number;
  itemsPerPage: number;
}

const Blogsection: React.FC<BlogsectionProps> = ({
  currentPage,
  itemsPerPage,
}) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/blogs?page=${currentPage}&limit=${itemsPerPage}`
        );

        // Extract blogs from response (API now returns { totalBlogs, currentPage, totalPages, blogs })
        const blogsData = res.data.blogs || res.data;
        setBlogs(blogsData);
        setError("");
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blogs. Please try again later.");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, [currentPage, itemsPerPage]);

  const buildImageUrl = (image: string) => {
    if (!image || String(image) === "undefined" || String(image) === "null") return "";
    // Backend returns full URL like http://job-backend:5000/uploads/blogs/file.jpg
    // We need to replace the host with the configured API_BASE_URL
    if (image.startsWith("http")) {
      try {
        const url = new URL(image);
        return `${API_BASE_URL}${url.pathname}`;
      } catch {
        return image;
      }
    }
    // Relative path: ensure single slash separator
    const cleanPath = image.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${API_BASE_URL}/${cleanPath}`;
  };

  return (
    <section className="p-6">
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600">{error}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No blogs available yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="bg-white border rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Blog Image */}
              {blog.image && (
                <img
                  src={buildImageUrl(blog.image)}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}

              {/* Blog Content */}
              <div className="p-4">
                {/* Meta info */}
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>{new Date(blog.date || blog.createdAt).toLocaleDateString()}</span>
                  <span>• {blog.author}</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {blog.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-3">{blog.body}</p>

                {/* Read More button */}
                <Link
                  to={`/blog/${blog._id}`}
                  className="mt-3 inline-block text-cyan-600 font-medium hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Blogsection;
