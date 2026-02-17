const {
  addReview,
  getReviewsForBook,
  getBookRatings,
} = require("../models/review.model");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/books/:id/reviews — add or update a review
const postReview = asyncHandler(async (req, res) => {
  const { rating, reviewText } = req.body;
  const bookId = req.params.id;
  const userId = req.user.id; // from JWT middleware
  if (!bookId || rating == null) {
    const error = new Error("bookId and rating are required");
    error.status = 400;
    throw error;
  }
  const review = await addReview({ userId, bookId, rating, reviewText });
  res.status(201).json(review);
});

// GET /api/books/:id/reviews — list reviews for a book
const getBookReviews = asyncHandler(async (req, res) => {
  res.json(await getReviewsForBook(req.params.id));
});

// GET /api/books/ratings — all books ranked by rating
const listBooksWithRatings = asyncHandler(async (req, res) => {
  res.json(await getBookRatings());
});

module.exports = { postReview, getBookReviews, listBooksWithRatings };
