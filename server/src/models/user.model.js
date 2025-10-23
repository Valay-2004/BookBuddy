const db = require("../config/database");

async function getUserProfile(userId) {
  const { rows } = await db.query(
    `
    SELECT 
        u.id AS user_id, 
        u.name, 
        u.email, 
        r.id AS review_id, 
        r.rating, 
        r.review_text, 
        b.title AS book_title
    FROM users u
    LEFT JOIN reviews r ON u.id = r.user_id
    LEFT JOIN books b ON r.book_id = b.id
    WHERE u.id = $1
`,
    [userId]
  );
}
