const db = require("../config/database");

// Fetch paginated books with aggregated review stats and sorting
async function getAllBooks(page = 1, limit = 5, sortBy = "newest") {
  const offset = (page - 1) * limit;

  let orderBy = "b.id DESC"; // Default: Adding time (proxy via ID)
  if (sortBy === "title") orderBy = "b.title ASC";
  if (sortBy === "year_new") orderBy = "b.published_year DESC NULLS LAST";
  if (sortBy === "year_old") orderBy = "b.published_year ASC NULLS LAST";

  const { rows } = await db.query(
    `SELECT b.id, b.title, b.author, b.description, b.cover_url, b.published_year,
            b.gutenberg_id, b.read_url,
            COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating,
            COUNT(r.id)::int AS review_count
     FROM books b LEFT JOIN reviews r ON b.id = r.book_id
     GROUP BY b.id
     ORDER BY ${orderBy}
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  const countRes = await db.query("SELECT COUNT(*)::int AS total FROM books");
  return { rows, total: countRes.rows[0].total };
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

// Search books by title or author (case-insensitive)
async function searchBooks(query) {
  const { rows } = await db.query(
    `SELECT b.id, b.title, b.author, b.description, b.cover_url, b.published_year,
            b.gutenberg_id, b.read_url,
            COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating,
            COUNT(r.id)::int AS review_count
     FROM books b LEFT JOIN reviews r ON b.id = r.book_id
     WHERE b.title ILIKE $1 OR b.author ILIKE $1
     GROUP BY b.id ORDER BY b.id`,
    [`%${query}%`],
  );
  return rows;
}

// Get the highest-rated book (must have at least 1 review)
async function getTopRatedBook() {
  const { rows } = await db.query(
    `SELECT b.*, COALESCE(AVG(r.rating), 0) AS avg_rating, COUNT(r.id)::int AS review_count
     FROM books b LEFT JOIN reviews r ON b.id = r.book_id
     GROUP BY b.id HAVING COUNT(r.id) > 0
     ORDER BY avg_rating DESC, review_count DESC LIMIT 1`,
  );
  return rows[0];
}

// Get a single book by ID with review stats
async function getBookById(id) {
  const { rows } = await db.query(
    `SELECT b.id, b.title, b.author, b.description, b.cover_url, b.published_year,
            b.gutenberg_id, b.read_url,
            COALESCE(ROUND(AVG(r.rating), 1), 0) AS avg_rating,
            COUNT(r.id)::int AS review_count
     FROM books b LEFT JOIN reviews r ON b.id = r.book_id
     WHERE b.id = $1 GROUP BY b.id`,
    [id],
  );
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
