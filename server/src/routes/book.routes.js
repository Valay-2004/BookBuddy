const express = require("express");
const { body, validationResult } = require("express-validator");
const { listBooks, addBook } = require("../controllers/book.controller");
const authenticate = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const router = express.Router();

// Validation middleware for book creation
const validateBook = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("author").trim().notEmpty().withMessage("Author is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
];

// Middleware to check validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Public route
router.get("/", listBooks);

// Protected route with validation
router.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  validateBook,
  handleValidationErrors,
  addBook
);

module.exports = router;
