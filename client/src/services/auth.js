import API from "./api";

// Signup
export async function signup(userData) {
  const response = await API.post("/auth/signup", userData);
  return response.data;
}

// Login
export async function login(credentials) {
  const response = await API.post("/auth/login", credentials);
  return response.data;
}
