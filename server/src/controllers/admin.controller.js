const db = require("../config/database");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/admin/reviews — list all reviews (admin only)
const getAllReviews = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    `SELECT r.id, r.rating, r.review_text, u.name AS user_name, b.title AS book_title
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN books b ON r.book_id = b.id
     ORDER BY r.created_at DESC`,
  );
  res.json({ success: true, data: rows });
});

// DELETE /api/admin/reviews/:id — delete a review (admin only)
const deleteReview = asyncHandler(async (req, res) => {
  await db.query("DELETE FROM reviews WHERE id = $1", [req.params.id]);
  res.json({ success: true, message: "Review deleted successfully" });
});

module.exports = { getAllReviews, deleteReview };
