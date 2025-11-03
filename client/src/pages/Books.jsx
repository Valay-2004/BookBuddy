import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const { token, user } = useAuth();

  useEffect(() => {
    async function fetchBooks() {
      const res = await API.get("/books");
      setBooks(res.data.books || res.data); // handle both formats
    }
    fetchBooks();
  }, []);

  async function handleAddBook(e) {
    e.preventDefault();
    try {
      const res = await API.post(
        "/books",
        { title, author, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBooks([...books, res.data]);
      setTitle("");
      setAuthor("");
      setDescription("");
      alert("Book added successfully");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Something went wrong"));
    }
  }
  return (
    <div style={{ padding: "2rem" }}>
      <h2>📖 Available Books</h2>
      <ul>
        {books.map((b) => (
          <li key={b.id} style={{ margin: "1rem 0" }}>
            <strong>{b.title}</strong> - {b.author}
            <p>{b.description}</p>
            <small>{b.description}</small>
          </li>
        ))}
      </ul>

      {user?.role === "admin" && (
        <div
          style={{
            marginTop: "2rem",
            borderTop: "1px solid #ccc",
            paddingTop: "1rem",
          }}
        >
          <h3>➕ Add New Book ➕</h3>
          <form onSubmit={handleAddBook}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />{" "}
            &nbsp;
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />{" "}
            &nbsp;
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />{" "}
            &nbsp;
            <button type="submit">Add Book</button>
          </form>
        </div>
      )}
    </div>
  );
}
