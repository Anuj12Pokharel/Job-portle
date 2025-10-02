import React, { useEffect, useState } from "react";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/jobs/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-4">
      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="text-center">
            <p className="font-medium">
              {cat.name} <span className="text-gray-600">({cat.count})</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
