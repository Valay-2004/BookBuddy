import axios from "axios";

// Our backend base URL
// (adjust port if the server runs on 5000)
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
