import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { useNavigate } from "react-router-dom";

interface Blog {
  _id: string;
  title: string;
  body: string;
  image: string;
  author: string;
  createdAt: string;
}

interface Props {
  currentPage: number;
  itemsPerPage: number;
}

const Blogsection: React.FC<Props> = ({
  currentPage,
  itemsPerPage,
}) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await axios.get(
        `${API_BASE_URL}/api/blogs?page=${currentPage}&limit=${itemsPerPage}`
      );
      setBlogs(res.data.blogs);
    };

    fetchBlogs();
  }, [currentPage, itemsPerPage]);

  return (
    <section className="p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <article
            key={blog._id}
            className="bg-white border rounded-2xl shadow-md overflow-hidden"
          >
            <img
              src={`${API_BASE_URL}${blog.image}`}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <div className="text-xs text-gray-500 mb-2">
                {new Date(blog.createdAt).toDateString()} • {blog.author}
              </div>

              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {blog.title}
              </h3>

              <p className="text-gray-600 text-sm line-clamp-3">
                {blog.body}
              </p>

              <button
                onClick={() => navigate(`/blogs/${blog._id}`)}
                className="mt-3 text-cyan-600 font-medium hover:underline"
              >
                Read More →
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Blogsection;
