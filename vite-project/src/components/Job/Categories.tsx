import React, { useEffect, useState } from "react";
import axios from "axios";

type Category = { name: string; count: number };

const Categories = () => {
  const backendBase =
    import.meta.env.VITE_API_BASE_URL ||
    "https://job-portle-backend-fsai.onrender.com";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${backendBase}/api/jobs/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Could not load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [backendBase]);

  return (
    <div className="p-3 w-full">
      {loading && (
        <div className="flex flex-col gap-2 max-h-80 overflow-hidden">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-10 rounded-md bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {!loading && !error && (
        <div className="max-h-80 overflow-auto pr-1">
          {categories.length === 0 && (
            <div className="text-sm text-gray-500">No categories found.</div>
          )}
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                className="flex w-full items-center justify-between rounded-md border border-gray-100 bg-white px-3 py-2 text-left shadow-sm hover:shadow transition focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <span className="text-sm font-medium text-gray-800">
                  {cat.name}
                </span>
                <span className="text-xs text-gray-500">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
