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

export const adminApi = {
  getUsers: () =>
    axios.get(`${API_BASE_URL}/api/admin/users`, getAuthConfig()),

  getEmployers: () =>
    axios.get(`${API_BASE_URL}/api/admin/employers`, getAuthConfig()),

  getJobs: () =>
    axios.get(`${API_BASE_URL}/api/jobs/get`, getAuthConfig()),

  verifyEmployer: (id: string, status: "approved" | "rejected") =>
    axios.put(
      `${API_BASE_URL}/api/admin/verify-employer/${id}`,
      { status },
      getAuthConfig()
    ),

  deleteUser: (id: string) =>
    axios.delete(
      `${API_BASE_URL}/api/admin/user/${id}`,
      getAuthConfig()
    ),

  deleteEmployer: (id: string) =>
    axios.delete(
      `${API_BASE_URL}/api/admin/employer/${id}`,
      getAuthConfig()
    ),

  deleteJob: (id: string) =>
    axios.delete(
      `${API_BASE_URL}/api/jobs/delete/${id}`,
      getAuthConfig()
    ),
};
