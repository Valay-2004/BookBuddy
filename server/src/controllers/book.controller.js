const { getAllBooks, createBook, deleteBookById, searchBooks: searchModel, getTopRatedBook } = require("../models/book.model");
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

async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteBookById(id);
    if (deleted) {
      res.json({ success: true, message: "Book deleted successfully" });
    } else {
      res.status(404).json({ success: false, error: "Book not found" });
    }
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ success: false, error: "Failed to delete book" });
  }
}

async function searchBooks(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: "Query parameter 'q' is required" });
    }
    const books = await searchModel(q);
    res.json({ success: true, books });
  } catch (err) {
    console.error("Error searching books:", err);
    res.status(500).json({ success: false, error: "Failed to search books" });
  }
}

async function getTopRated(req, res) {
  try {
    const book = await getTopRatedBook();
    res.json({ success: true, book: book || null });
  } catch (err) {
    console.error("Error fetching top rated book:", err);
    res.status(500).json({ success: false, error: "Failed to fetch top rated book" });
  }
}

module.exports = { listBooks, addBook, deleteBook, searchBooks, getTopRated };
