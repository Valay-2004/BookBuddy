const db = require("../config/database");

async function getAllBooks() {
  const { rows } = await db.query("SELECT * FROM books");
  return rows;
}

async function createBook(title, author, description) {
  const { rows } = await db.query(
    "INSERT INTO books (title, author, description) VALUES ($1, $2, $3) RETURNING *",
    [title, author, description]
  );
  return rows[0];
}

module.exports = { getAllBooks, createBook };
