import React, { useEffect, useState } from "react";

export default function Blogsection({ currentPage, itemsPerPage }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${itemsPerPage}`
        );
        const data = await res.json();

        // Enhance each blog with dummy image, date, and author
        const enhancedData = data.map((blog) => ({
          ...blog,
          image: `https://picsum.photos/seed/${blog.id}/400/250`, // unique image
          date: new Date(Date.now() - blog.id * 10000000).toDateString(), // fake publish date
          author: `Author ${blog.userId}`, // dummy author
        }));

        setBlogs(enhancedData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }

    fetchBlogs();
  }, [currentPage, itemsPerPage]);

  return (
    <section className="p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="bg-white border rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {/* Blog Image */}
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />

            {/* Blog Content */}
            <div className="p-4">
              {/* Meta info */}
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{blog.date}</span>
                <span>✍ {blog.author}</span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {blog.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-3">{blog.body}</p>

              {/* Read More button */}
              <button className="mt-3 text-cyan-600 font-medium hover:underline">
                Read More →
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
