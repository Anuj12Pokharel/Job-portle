// Central place to read the API base URL.
// Falls back to the deployed backend if no env var is provided.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://job-portle-backend-fsai.onrender.com";
