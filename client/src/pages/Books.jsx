import { useEffect, useState } from "react";
import { fetchBooks } from "../services/books";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await fetchBooks();
        setBooks(data);
      } catch (err) {
        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  if (loading) return <p>📚 Loading books...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📖 Available Books</h2>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id} style={{ margin: "1rem 0" }}>
              <strong>{books.title}</strong> - {book.author}
              <br />
              <small>{books.description}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
