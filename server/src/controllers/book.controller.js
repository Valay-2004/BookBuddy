const { getAllBooks, createBook, deleteBookById, searchBooks: searchModel, getTopRatedBook, getBookById: getBookModelById } = require("../models/book.model");
const asyncHandler = require("../utils/asyncHandler");

const listBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const { rows, total } = await getAllBooks(page, limit);
  const totalPages = Math.ceil(total / limit);
  res.json({ success: true, page, limit, total, totalPages, books: rows });
});

const addBook = asyncHandler(async (req, res) => {
  const { title, author, summary, description, isbn, cover_url, published_year, gutenberg_id } = req.body;
  // Handle both description and summary (legacy)
  const bookDescription = description || summary;
  
  if (!title || !author) {
    const error = new Error("Title and Author are required.");
    error.status = 400;
    throw error;
  }

  const newBook = await createBook(title, author, bookDescription, isbn, cover_url, published_year, gutenberg_id);
  return res.status(201).json(newBook);
});

const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteBookById(id);
  if (deleted) {
    res.json({ success: true, message: "Book deleted successfully" });
  } else {
    const error = new Error("Book not found.");
    error.status = 404;
    throw error;
  }
});

const searchBooks = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    const error = new Error("Query parameter 'q' is required.");
    error.status = 400;
    throw error;
  }
  const books = await searchModel(q);
  res.json({ success: true, books });
});

const getTopRated = asyncHandler(async (req, res) => {
  const book = await getTopRatedBook();
  res.json({ success: true, book: book || null });
});

const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const book = await getBookModelById(id);
  if (book) {
    res.json({ success: true, book });
  } else {
    const error = new Error("Book not found.");
    error.status = 404;
    throw error;
  }
});

module.exports = { listBooks, addBook, deleteBook, searchBooks, getTopRated, getBookById };
