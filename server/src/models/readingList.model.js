const db = require("../config/database");

async function getUserReadingLists(userId) {
  const { rows } = await db.query(
    "SELECT * FROM reading_lists WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

async function createReadingList(userId, name, description, isPublic) {
  const { rows } = await db.query(
    "INSERT INTO reading_lists (user_id, name, description, is_public) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, name, description, isPublic]
  );
  return rows[0];
}

async function getReadingListById(id) {
  const { rows } = await db.query(
    "SELECT rl.*, u.name as creator_name FROM reading_lists rl JOIN users u ON rl.user_id = u.id WHERE rl.id = $1",
    [id]
  );
  return rows[0];
}

async function addBookToList(readingListId, bookId) {
  const { rows } = await db.query(
    "INSERT INTO reading_list_books (reading_list_id, book_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *",
    [readingListId, bookId]
  );
  return rows[0];
}

async function removeBookFromList(readingListId, bookId) {
  const { rows } = await db.query(
    "DELETE FROM reading_list_books WHERE reading_list_id = $1 AND book_id = $2 RETURNING *",
    [readingListId, bookId]
  );
  return rows.length > 0;
}

async function getBooksInList(readingListId) {
  const { rows } = await db.query(
    "SELECT b.* FROM books b JOIN reading_list_books rlb ON b.id = rlb.book_id WHERE rlb.reading_list_id = $1 ORDER BY rlb.added_at DESC",
    [readingListId]
  );
  return rows;
}

module.exports = {
  getUserReadingLists,
  createReadingList,
  getReadingListById,
  addBookToList,
  removeBookFromList,
  getBooksInList,
};
