const { getAllBooks, createBook } = require("../models/book.model");
const { deleteBook } = require("./admin.controller");
// console.log(require("../models/book.model"));
async function listBooks(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const { rows, total } = await getAllBooks(page, limit);
    const totalPages = Math.ceil(total / limit);
    res.json({ success: true, page, limit, total, totalPages, books: rows });
  } catch (err) {
    console.error("❌ ERROR in listBooks:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function addBook(req, res) {
  try {
    const { title, author, summary, description, isbn, cover_url, published_year } = req.body;
    // Handle both description and summary (legacy)
    const bookDescription = description || summary;
    
    const newBook = await createBook(title, author, bookDescription, isbn, cover_url, published_year);
    return res.status(201).json(newBook);
  } catch (err) {
    console.error("Error adding book:", err);
    return res.status(500).json({ error: "Failed to add book" });
  }
}

module.exports = { listBooks, addBook };
