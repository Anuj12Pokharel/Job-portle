import { useState } from "react";
import axios from "axios";
import { h1 } from "framer-motion/m";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CreateTeam = () => {
  const [form, setForm] = useState({
    name: "",
    designation: "",
    bio: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("designation", form.designation);
      formData.append("bio", form.bio);
      if (image) {
        formData.append("image", image);
      }

      await axios.post(`${API_BASE_URL}/api/team/add`, // change if needed
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Team member added successfully");
      setForm({ name: "", designation: "", bio: "" });
      setImage(null);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong ❌"
      );
    } finally {
      setLoading(false);
    }
  };
   


  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Team Member</h2>

      {message && <p className="mb-3 text-sm">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={form.designation}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Add Team Member"}
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;
