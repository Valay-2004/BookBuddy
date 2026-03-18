const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  postReview,
  getBookReviews,
  listBooksWithRatings,
} = require("../controllers/review.controller");
const authenticate = require("../middleware/auth");
const cacheFor = require("../middleware/cacheHeaders");
const router = express.Router();

// Validation for review creation
const validateReview = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
  body("reviewText").trim().optional({ checkFalsy: true }),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

// Public: get all books ranked by rating
router.get("/books/ratings", cacheFor(60), listBooksWithRatings);

// Public: get reviews for a specific book
router.get("/books/:id/reviews", cacheFor(60), getBookReviews);

// Protected: add/update a review
router.post(
  "/books/:id/reviews",
  authenticate,
  validateReview,
  handleValidation,
  postReview,
);

module.exports = router;
