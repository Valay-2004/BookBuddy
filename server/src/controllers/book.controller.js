const {
  getAllBooks,
  createBook,
  deleteBookById,
  searchBooks: searchModel,
  getTopRatedBook,
  getBookById: getBookModelById,
} = require("../models/book.model");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/books — paginated list
const listBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sortBy = req.query.sortBy || "newest";

  const { rows, total } = await getAllBooks(page, limit, sortBy);
  res.json({
    success: true,
    page,
    limit,
    sortBy,
    total,
    totalPages: Math.ceil(total / limit),
    books: rows,
  });
});

// POST /api/books — admin creates a book
const addBook = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    summary,
    description,
    cover_url,
    published_year,
    gutenberg_id,
    read_url,
  } = req.body;
  const bookDescription = description || summary;
  if (!title || !author) {
    const error = new Error("Title and Author are required.");
    error.status = 400;
    throw error;
  }
  const newBook = await createBook(
    title,
    author,
    bookDescription,
    cover_url,
    published_year,
    gutenberg_id,
    read_url,
  );
  res.status(201).json(newBook);
});

// DELETE /api/books/:id — admin deletes a book
const deleteBook = asyncHandler(async (req, res) => {
  const deleted = await deleteBookById(req.params.id);
  if (!deleted) {
    const error = new Error("Book not found.");
    error.status = 404;
    throw error;
  }
  res.json({ success: true, message: "Book deleted successfully" });
});

// GET /api/books/search?q= — search by title or author
const searchBooks = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    const error = new Error("Query parameter 'q' is required.");
    error.status = 400;
    throw error;
  }
  res.json({ success: true, books: await searchModel(q) });
});

// GET /api/books/top-rated — single highest-rated book
const getTopRated = asyncHandler(async (req, res) => {
  res.json({ success: true, book: (await getTopRatedBook()) || null });
});

// GET /api/books/:id — single book details
const getBookById = asyncHandler(async (req, res) => {
  const book = await getBookModelById(req.params.id);
  if (!book) {
    const error = new Error("Book not found.");
    error.status = 404;
    throw error;
  }
  res.json({ success: true, book });
});

module.exports = {
  listBooks,
  addBook,
  deleteBook,
  searchBooks,
  getTopRated,
  getBookById,
};
