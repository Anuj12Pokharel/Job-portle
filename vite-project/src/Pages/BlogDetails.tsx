import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useParams } from "react-router-dom";

interface Blog {
  title: string;
  body: string;
  image: string;
  author: string;
  createdAt: string;
}

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await axios.get(`${API_BASE_URL}/api/blogs/${id}`);
      setBlog(res.data);
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section className="max-w-4xl mx-auto p-6">
      <img
        src={`${API_BASE_URL}${blog.image}`}
        alt={blog.title}
        className="w-full h-72 object-cover rounded-xl mb-6"
      />

      <div className="text-sm text-gray-500 mb-2">
        {new Date(blog.createdAt).toDateString()} • {blog.author}
      </div>

      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {blog.body}
      </p>
    </section>
  );
};

export default BlogDetails;
