import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Camera, Loader2, Save, Trash2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface Banner {
  _id: string;
  type: string;
  backgroundImage: string;
  title?: string;
  subtitle?: string;
  isActive: boolean;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    type: "job-search",
    title: "",
    subtitle: "",
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/banners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setBanners(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("type", formData.type);
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("isActive", String(formData.isActive));

      if (selectedFile) {
        data.append("backgroundImage", selectedFile);
      }

      await axios.post(`${API_BASE_URL}/api/banners`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Banner saved successfully!");
      fetchBanners();
      resetForm();
    } catch (error: any) {
      console.error("Error saving banner:", error);
      alert(error.response?.data?.message || "Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Banner deleted successfully!");
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner");
    }
  };

  const resetForm = () => {
    setFormData({
      type: "job-search",
      title: "",
      subtitle: "",
      isActive: true,
    });
    setSelectedFile(null);
    setPreviewImage(null);
    setSelectedBanner(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-xl font-bold text-white">Banner Management</h1>
            <p className="text-blue-100 text-sm">Manage homepage and section banners</p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  {selectedBanner ? "Edit Banner" : "Create/Update Banner"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banner Type
                    </label>
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. home, job-search, training"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Banner title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Banner subtitle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Background Image
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Choose Image
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      {selectedFile && (
                        <span className="text-sm text-gray-600">{selectedFile.name}</span>
                      )}
                    </div>
                    {previewImage && (
                      <div className="mt-4">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Banner
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Banners List */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Existing Banners</h2>
                <div className="space-y-4">
                  {banners.length === 0 ? (
                    <p className="text-gray-500 text-sm">No banners created yet.</p>
                  ) : (
                    banners.map((banner) => (
                      <div
                        key={banner._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 capitalize">
                                {banner.type.replace("-", " ")}
                              </h3>
                              {banner.isActive && (
                                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                                  Active
                                </span>
                              )}
                            </div>
                            {banner.title && (
                              <p className="text-sm text-gray-600 mb-1">{banner.title}</p>
                            )}
                            {banner.backgroundImage && (
                              <img
                                src={`${API_BASE_URL}${banner.backgroundImage}`}
                                alt={banner.type}
                                className="w-full h-24 object-cover rounded mt-2"
                              />
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(banner._id)}
                            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete Banner"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerManagement;
