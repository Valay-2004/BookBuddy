const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  postReview,
  getBookReviews,
  listBooksWithRatings,
} = require("../controllers/review.controller");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Validation middleware for review creation
const validateReview = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("reviewText").trim().optional({ checkFalsy: true }),
];

// Middleware to check validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// get all books with average ratings
// list books with average ratings (non-conflicting path)
router.get("/books/ratings", listBooksWithRatings);

// get reviews for a single book
router.get("/books/:id/reviews", getBookReviews);

// add/update a review (protected) - prefer book id in URL
router.post(
  "/books/:id/reviews",
  authenticate,
  validateReview,
  handleValidationErrors,
  postReview
);

module.exports = router;
