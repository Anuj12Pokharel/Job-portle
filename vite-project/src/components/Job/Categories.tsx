import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Category = { name: string; count: number };

const Categories = ({ onSelect }: { onSelect?: () => void }) => {
  const navigate = useNavigate();
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
        <div className="max-h-80 overflow-auto pr-1 custom-scrollbar">
          {categories.length === 0 && (
            <div className="text-sm text-gray-500">No categories found.</div>
          )}
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  navigate(`/?category=${encodeURIComponent(cat.name)}`);
                  if (onSelect) onSelect();
                }}
                className="flex w-full items-center justify-between rounded-md border-b border-gray-50 bg-white px-3 py-2 text-left hover:bg-gray-50 transition focus:outline-none"
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
