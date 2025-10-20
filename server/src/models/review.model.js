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
