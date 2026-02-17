import axios from "axios";

// Our backend base URL - Support environment variable for production
// Production / Deployable version
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage for convenience
API.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (unauthorized) - token might be expired
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Reading Lists API
export const readingListAPI = {
  getUserLists: () => API.get("/reading-lists"),
  createList: (data) => API.post("/reading-lists", data),
  getList: (id) => API.get(`/reading-lists/${id}`),
  addBook: (listId, bookId) =>
    API.post(`/reading-lists/${listId}/books/${bookId}`),
  removeBook: (listId, bookId) =>
    API.delete(`/reading-lists/${listId}/books/${bookId}`),
};

export default API;
