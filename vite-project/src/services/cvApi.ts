import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const cvApi = {
  // Get CV profile data
  getCVProfile: () =>
    axios.get(`${API_BASE_URL}/api/cv/profile`, getAuthConfig()),

  // Update CV profile data
  updateCVProfile: (cvData: any) =>
    axios.put(`${API_BASE_URL}/api/cv/profile`, cvData, getAuthConfig()),

  // Generate PDF CV
  generatePDF: () =>
    axios.post(`${API_BASE_URL}/api/cv/generate`, {}, {
      ...getAuthConfig(),
      responseType: 'blob'
    }),
};