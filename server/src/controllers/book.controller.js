const { getAllBooks, createBook } = require("../models/book.model");
const { deleteBook } = require("./admin.controller");
// console.log(require("../models/book.model"));
async function listBooks(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const books = await getAllBooks(page, limit);
    res.json({ success: true, page, limit, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addBook(req, res) {
  try {
    const { title, author, description } = req.body;
    const newBook = await createBook(title, author, description);
    return res.status(201).json(newBook);
  } catch (err) {
    console.error("Error adding book:", err);
    return res.status(500).json({ error: "Failed to add book" });
  }
}

module.exports = { listBooks, addBook };
