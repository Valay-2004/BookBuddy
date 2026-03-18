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

// Get all reviews for a specific book - limit to latest 50
async function getReviewsForBook(bookId) {
  const { rows } = await db.query(
    `SELECT r.id, r.rating, r.review_text, r.created_at, u.name AS reviewer_name
     FROM reviews r JOIN users u ON r.user_id = u.id
     WHERE r.book_id = $1 ORDER BY r.created_at DESC
     LIMIT 50`,
    [bookId],
  );
  return rows;
}

// Get all books ranked by average rating (limit to top 50)
async function getBookRatings() {
  const { rows } = await db.query(
    `SELECT id, title, author, avg_rating AS average_rating, review_count AS total_reviews
     FROM books
     WHERE review_count > 0
     ORDER BY avg_rating DESC, review_count DESC
     LIMIT 50`,
  );
  return rows;
}

module.exports = { addReview, getReviewsForBook, getBookRatings };
