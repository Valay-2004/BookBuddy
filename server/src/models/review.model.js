// get the databse
const db = require("../config/database");

// create an addReview function
async function addReview({ userId, bookId, rating, reviewText }) {
  const { rows } = await db.query(
    `INSERT INTO reviews (user_id, book_id, rating, review_text)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, book_id)
        DO UPDATE SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text, created_at = NOW()
        RETURNING *`,
    [userId, bookId, rating, reviewText]
  );
  return rows[0];
}

// create a getReviews for book function
async function getReviewsForBook(bookId) {
  const { rows } = await db.query(
    `SELECT r.id, r.rating, r.review_text, r.created_at, u.name AS reviewer_name
    FROM reviews r
    JOIN users u ON r.user_id = u_id
    WHERE r.book_id = $1
    ORDER BY r.created_at DESC`,
    [bookId]
  );
}
