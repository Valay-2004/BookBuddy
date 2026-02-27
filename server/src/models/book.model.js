const db = require("../config/database");

// Fetch paginated books with denormalized review stats and sorting
// Optimization: Using COUNT(*) OVER() to get total count in a single query
async function getAllBooks(page = 1, limit = 5, sortBy = "newest") {
  const offset = (page - 1) * limit;

  let orderBy = "id DESC"; // Default: Adding time (proxy via ID)
  if (sortBy === "title") orderBy = "title ASC";
  if (sortBy === "year_new") orderBy = "published_year DESC NULLS LAST";
  if (sortBy === "year_old") orderBy = "published_year ASC NULLS LAST";

  const { rows } = await db.query(
    `SELECT *, COUNT(*) OVER()::int AS total 
     FROM books
     ORDER BY ${orderBy}
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );

  const total = rows.length > 0 ? rows[0].total : 0;
  return { rows, total };
}

// Create a new book entry
async function createBook(
  title,
  author,
  description,
  cover_url = null,
  published_year = null,
  gutenberg_id = null,
  read_url = null,
) {
  const { rows } = await db.query(
    `INSERT INTO books (title, author, description, cover_url, published_year, gutenberg_id, read_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      title,
      author,
      description,
      cover_url,
      published_year,
      gutenberg_id,
      read_url,
    ],
  );
  return rows[0];
}

// Delete a book by ID
async function deleteBookById(id) {
  const { rowCount } = await db.query("DELETE FROM books WHERE id = $1", [id]);
  return rowCount > 0;
}

// Search books by title or author (case-insensitive) - uses denormalized columns
async function searchBooks(query) {
  const { rows } = await db.query(
    `SELECT * FROM books 
     WHERE title ILIKE $1 OR author ILIKE $1
     ORDER BY id DESC LIMIT 50`,
    [`%${query}%`],
  );
  return rows;
}

// Get the highest-rated book (must have at least 1 review) - uses denormalized columns
async function getTopRatedBook() {
  const { rows } = await db.query(
    `SELECT * FROM books 
     WHERE review_count > 0
     ORDER BY avg_rating DESC, review_count DESC LIMIT 1`,
  );
  return rows[0];
}

// Get a single book by ID with review stats - uses denormalized columns
async function getBookById(id) {
  const { rows } = await db.query(`SELECT * FROM books WHERE id = $1`, [id]);
  return rows[0];
}

module.exports = {
  getAllBooks,
  createBook,
  deleteBookById,
  searchBooks,
  getTopRatedBook,
  getBookById,
};
