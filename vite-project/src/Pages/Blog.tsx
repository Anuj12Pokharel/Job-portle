import React, { useState } from "react";
import Hero from "../components/Blog/Hero";
import Blogsection from "../components/Blog/Blogsection";
import Pagination from "../components/Blog/Pagination";

const Blog: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6; // how many blogs per page
  const totalItems = 100; // jsonplaceholder has 100 posts
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <Hero />
      <h1 className="text-3xl font-bold text-center my-6 text-cyan-600">
        Blogs
      </h1>

      {/* Blog list */}
      <Blogsection currentPage={currentPage} itemsPerPage={itemsPerPage} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Blog;
