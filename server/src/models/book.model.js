const db = require("../config/database");

async function getAllBooks(page = 1, limit = 5) {
  const offset = (page - 1) * limit;
  // Get paginated rows
  const { rows } = await db.query(
    "SELECT * FROM books ORDER BY id LIMIT $1 OFFSET $2",
    [limit, offset]
  );

  // Get total count for pagination metadata
  const countRes = await db.query("SELECT COUNT(*)::int AS total FROM books");
  const total = countRes.rows[0].total;

  return { rows, total };
}

async function createBook(title, author, description) {
  const { rows } = await db.query(
    "INSERT INTO books (title, author, description) VALUES ($1, $2, $3) RETURNING *",
    [title, author, description]
  );
  return rows[0];
}

module.exports = { getAllBooks, createBook };
