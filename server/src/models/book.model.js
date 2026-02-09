const db = require("../config/database");

async function getAllBooks(page = 1, limit = 5) {
  const offset = (page - 1) * limit;
  // Get paginated rows with new fields
  const { rows } = await db.query(
    `SELECT 
       b.id, b.title, b.author, b.description, b.isbn, b.cover_url, b.published_year, b.gutenberg_id,
       COALESCE(ROUND(AVG(r.rating), 1), 0) as avg_rating,
       COUNT(r.id) as review_count
     FROM books b
     LEFT JOIN reviews r ON b.id = r.book_id
     GROUP BY b.id
     ORDER BY b.id 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  // Get total count for pagination metadata
  const countRes = await db.query("SELECT COUNT(*)::int AS total FROM books");
  const total = countRes.rows[0].total;

  return { rows, total };
}

async function createBook(title, author, description, isbn = null, cover_url = null, published_year = null, gutenberg_id = null) {
  const { rows } = await db.query(
    "INSERT INTO books (title, author, description, isbn, cover_url, published_year, gutenberg_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [title, author, description, isbn, cover_url, published_year, gutenberg_id]
  );
  return rows[0];
}

async function deleteBookById(id) {
  const { rowCount } = await db.query("DELETE FROM books WHERE id = $1", [id]);
  return rowCount > 0;
}

async function searchBooks(query) {
  const { rows } = await db.query(
    `SELECT 
       b.id, b.title, b.author, b.description, b.isbn, b.cover_url, b.published_year, b.gutenberg_id,
       COALESCE(ROUND(AVG(r.rating), 1), 0) as avg_rating,
       COUNT(r.id) as review_count
     FROM books b
     LEFT JOIN reviews r ON b.id = r.book_id
     WHERE b.title ILIKE $1 OR b.author ILIKE $1
     GROUP BY b.id
     ORDER BY b.id`,
    [`%${query}%`]
  );
  return rows;
}

async function getTopRatedBook() {
  const { rows } = await db.query(`
    SELECT 
      b.*, 
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(r.id) as review_count
    FROM books b
    LEFT JOIN reviews r ON b.id = r.book_id
    GROUP BY b.id
    HAVING COUNT(r.id) > 0
    ORDER BY avg_rating DESC, review_count DESC
    LIMIT 1
  `);
  return rows[0];
}

async function getBookById(id) {
  const { rows } = await db.query(
    `SELECT 
       b.id, b.title, b.author, b.description, b.isbn, b.cover_url, b.published_year, b.gutenberg_id,
       COALESCE(ROUND(AVG(r.rating), 1), 0) as avg_rating,
       COUNT(r.id) as review_count
     FROM books b
     LEFT JOIN reviews r ON b.id = r.book_id
     WHERE b.id = $1
     GROUP BY b.id`,
    [id]
  );
  return rows[0];
}

module.exports = { getAllBooks, createBook, deleteBookById, searchBooks, getTopRatedBook, getBookById };
