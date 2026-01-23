const db = require("../config/database");

async function getAllBooks(page = 1, limit = 5) {
  const offset = (page - 1) * limit;
  // Get paginated rows with new fields
  const { rows } = await db.query(
    "SELECT id, title, author, description, isbn, cover_url, published_year FROM books ORDER BY id LIMIT $1 OFFSET $2",
    [limit, offset]
  );

  // Get total count for pagination metadata
  const countRes = await db.query("SELECT COUNT(*)::int AS total FROM books");
  const total = countRes.rows[0].total;

  return { rows, total };
}

async function createBook(title, author, description, isbn = null, cover_url = null, published_year = null) {
  const { rows } = await db.query(
    "INSERT INTO books (title, author, description, isbn, cover_url, published_year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [title, author, description, isbn, cover_url, published_year]
  );
  return rows[0];
}

module.exports = { getAllBooks, createBook };
