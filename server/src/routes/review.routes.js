const express = require("express");
const {
  postReview,
  getBookReviews,
  listBooksWithRatings,
} = require("../controllers/review.controller");
const authenticate = require("../middleware/auth");

const router = express.Router();

// get all books with average ratings
// list books with average ratings (non-conflicting path)
router.get("/books/ratings", listBooksWithRatings);

// get reviews for a single book
router.get("/books/:id/reviews", getBookReviews);

// add/update a review (protected) - prefer book id in URL
router.post("/books/:id/reviews", authenticate, postReview);

module.exports = router;
