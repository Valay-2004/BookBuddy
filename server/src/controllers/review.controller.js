const {
  addReview,
  getReviewsForBook,
  getBookRatings,
} = require("../models/review.model");
const asyncHandler = require("../utils/asyncHandler");
const cache = require("../utils/cache");

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

  // Invalidate caches
  cache.invalidate(`reviews:${bookId}`);
  cache.invalidate("books:*"); // Review stats (avg_rating) changed
  cache.invalidate(`book:${bookId}`);
  cache.invalidate("top-rated");

  res.status(201).json(review);
});

// GET /api/books/:id/reviews — list reviews for a book
const getBookReviews = asyncHandler(async (req, res) => {
  const cacheKey = `reviews:${req.params.id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  const reviews = await getReviewsForBook(req.params.id);
  cache.set(cacheKey, reviews);
  res.json(reviews);
});

// GET /api/books/ratings — all books ranked by rating
const listBooksWithRatings = asyncHandler(async (req, res) => {
  const cacheKey = "books:ratings";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  const ratings = await getBookRatings();
  cache.set(cacheKey, ratings);
  res.json(ratings);
});

module.exports = { postReview, getBookReviews, listBooksWithRatings };
