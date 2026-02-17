const express = require("express");
const { body, validationResult } = require("express-validator");
const {
  listBooks,
  addBook,
  deleteBook,
  searchBooks,
  getTopRated,
  getBookById,
} = require("../controllers/book.controller");
const authenticate = require("../middleware/auth");
const { authorizeRole } = require("../middleware/auth");
const router = express.Router();

// Validation for book creation
const validateBook = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("author").trim().notEmpty().withMessage("Author is required"),
  body("description").optional().trim(),
];

// Check validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

// Public routes
router.get("/", listBooks);
router.get("/search", searchBooks);
router.get("/top-rated", getTopRated);
router.get("/:id", getBookById);

// Admin-only routes
router.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  validateBook,
  handleValidation,
  addBook,
);
router.delete("/:id", authenticate, authorizeRole("admin"), deleteBook);

module.exports = router;
