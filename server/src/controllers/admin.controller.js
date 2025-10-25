const db = require("../config/database");

// create book role
async function createBook(req, res) {
  try {
    const { title, author, description } = req.body;
    const { rows } = await db.query(
      "INSERT INTO books (title, author, description) VALUES ($1, $2, $3) RETURNING *",
      [title, author, description]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// role for deleting a book
async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.json({ success: true, message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// role for getting all the reviews
async function getAllReviews(req, res) {
  try {
    const { rows } = await db.query(
      `SELECT r.id, r.rating, r.review_text, u.name AS user_name, b.title AS book_title
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN books b ON r.book_id = b.id
       ORDER BY r.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// role for deleting a review
async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM reviews WHERE id = $1", [id]);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { createBook, deleteBook, getAllReviews, deleteReview };
