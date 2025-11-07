const db = require("../config/database");

async function getUserProfile(userId) {
  const { rows } = await db.query(
    `
    SELECT 
        u.id AS user_id, 
        u.name, 
        u.email, 
        u.role AS role,
        r.id AS review_id, 
        r.rating, 
        r.review_text, 
        b.title AS book_title
    FROM users u
    LEFT JOIN reviews r ON u.id = r.user_id
    LEFT JOIN books b ON r.book_id = b.id
    WHERE u.id = $1`,
    [userId]
  );

  if (rows.length === 0) return null;

  const user = {
    id: rows[0].user_id,
    name: rows[0].name,
    email: rows[0].email,
    role: rows[0].role || "user",
    reviews: rows
      .filter((row) => row.review_id !== null)
      .map((row) => ({
        review_id: row.review_id,
        rating: row.rating,
        review_text: row.review_text,
        book_title: row.book_title,
      })),
  };

  return user;
}

module.exports = { getUserProfile };
