import API from "./api";

// Get all books
export async function fetchBooks() {
  const response = await API.get("/books");
  return response.data;
}
