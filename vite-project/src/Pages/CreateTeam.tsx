import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CreateTeam = () => {
    const [form, setForm] = useState({
        name: "",
        designation: "",
        bio: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("designation", form.designation);
            formData.append("bio", form.bio);
            if (image) {
                formData.append("image", image);
            }

            await axios.post(`${API_BASE_URL}/api/team/add`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Team member added successfully");
            setForm({ name: "", designation: "", bio: "" });
            setImage(null);
            setImagePreview("");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Something went wrong ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Create Team Member</h2>

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

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Team Member Photo</label>
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
                            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-full border" />
                        </div>
                    )}
                </div>

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
