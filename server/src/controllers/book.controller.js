const {
  getAllBooks,
  createBook,
  deleteBookById,
  searchBooks: searchModel,
  getTopRatedBook,
  getBookById: getBookModelById,
} = require("../models/book.model");
const asyncHandler = require("../utils/asyncHandler");
const cache = require("../utils/cache");

// GET /api/books — paginated list
const listBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sortBy = req.query.sortBy || "newest";

  const cacheKey = `books:page:${page}:limit:${limit}:sort:${sortBy}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  const { rows, total } = await getAllBooks(page, limit, sortBy);
  const response = {
    success: true,
    page,
    limit,
    sortBy,
    total,
    totalPages: Math.ceil(total / limit),
    books: rows,
  };

  cache.set(cacheKey, response);
  res.json(response);
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

  // Invalidate books cache
  cache.invalidate("books:*");
  cache.invalidate("top-rated");

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

  // Invalidate caches
  cache.invalidate("books:*");
  cache.invalidate(`book:${req.params.id}`);
  cache.invalidate("top-rated");

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

  const cacheKey = `search:${q.toLowerCase()}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  const books = await searchModel(q);
  const response = { success: true, books };

  cache.set(cacheKey, response);
  res.json(response);
});

// GET /api/books/top-rated — single highest-rated book
const getTopRated = asyncHandler(async (req, res) => {
  const cacheKey = "top-rated";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  const book = await getTopRatedBook();
  const response = { success: true, book: book || null };

  cache.set(cacheKey, response);
  res.json(response);
});

// GET /api/books/:id — single book details
const getBookById = asyncHandler(async (req, res) => {
  const cacheKey = `book:${req.params.id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  const book = await getBookModelById(req.params.id);
  if (!book) {
    const error = new Error("Book not found.");
    error.status = 404;
    throw error;
  }

  const response = { success: true, book };
  cache.set(cacheKey, response);
  res.json(response);
});

module.exports = {
  listBooks,
  addBook,
  deleteBook,
  searchBooks,
  getTopRated,
  getBookById,
};
