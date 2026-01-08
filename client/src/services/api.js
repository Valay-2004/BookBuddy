import axios from "axios";

// Our backend base URL
// (adjust port if the server runs on 5000)
const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
