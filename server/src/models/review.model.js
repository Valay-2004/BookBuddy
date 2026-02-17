const db = require("../config/database");

// Create or update a review (upsert on user_id + book_id)
async function addReview({ userId, bookId, rating, reviewText }) {
  const { rows } = await db.query(
    `INSERT INTO reviews (user_id, book_id, rating, review_text)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, book_id)
     DO UPDATE SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text, created_at = NOW()
     RETURNING *`,
    [userId, bookId, rating, reviewText],
  );
  return rows[0];
}

// Get all reviews for a specific book
async function getReviewsForBook(bookId) {
  const { rows } = await db.query(
    `SELECT r.id, r.rating, r.review_text, r.created_at, u.name AS reviewer_name
     FROM reviews r JOIN users u ON r.user_id = u.id
     WHERE r.book_id = $1 ORDER BY r.created_at DESC`,
    [bookId],
  );
  return rows;
}

// Get all books ranked by average rating
async function getBookRatings() {
  const { rows } = await db.query(
    `SELECT b.id, b.title, b.author,
            COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
            COUNT(r.id)::int AS total_reviews
     FROM books b LEFT JOIN reviews r ON b.id = r.book_id
     GROUP BY b.id ORDER BY average_rating DESC`,
  );
  return rows;
}

module.exports = { addReview, getReviewsForBook, getBookRatings };
