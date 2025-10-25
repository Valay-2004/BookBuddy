const db = require("../config/database");

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

async function deleteBook(req, res) {
  try {
    const { id } = req.params;
  } catch (err) {}
}
