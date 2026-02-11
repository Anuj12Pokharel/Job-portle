import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Createblog = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("author", author);
    if (image) formData.append("image", image);

    try {
      setLoading(true);

      await axios.post(`${API_BASE_URL}/api/blog`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Blog posted successfully");

      setTitle("");
      setBody("");
      setAuthor("");
      setImage(null);
      setImagePreview("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Post Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border p-2 rounded h-32"
          required
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
            className="w-full border p-2 rounded"
          />
          {imagePreview && (
            <div className="mt-3">
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded border" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Posting..." : "Post Blog"}
        </button>
      </form>
    </div>
  );
};

export default Createblog;
