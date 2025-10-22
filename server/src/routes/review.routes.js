const express = require("express");
const {
  postReview,
  getBookReviews,
  listBooksWithRatings,
} = require("../controllers/review.controller");
const authenticate = require("../middleware/auth");

const router = express.Router();

// get all books with average ratings
router.get("/books", listBooksWithRatings);

// get reviews for a single book
router.get("/books/:id/reviews", getBookReviews);

// add/update a review (protected)
router.post("/books/reviews", authenticate, postReview);

module.exports = router;
