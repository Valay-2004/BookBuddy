const express = require("express");
const { body, validationResult } = require("express-validator");
const { listBooks, addBook, deleteBook, searchBooks, getTopRated } = require("../controllers/book.controller");
const authenticate = require("../middleware/auth");
const { authorizeRole } = require("../middleware/auth"); // Fixing the import
const router = express.Router();

// Validation middleware for book creation
const validateBook = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("author").trim().notEmpty().withMessage("Author is required"),
  // Allow both description and summary (alias)
  body("description")
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (!value && !req.body.summary) {
        throw new Error("Description or summary is required");
      }
      return true;
    }),
];

// Middleware to check validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Public routes
router.get("/", listBooks);
router.get("/search", searchBooks);
router.get("/top-rated", getTopRated);

// Protected routes
router.post(
  "/",
  authenticate,
  authorizeRole("admin"),
  validateBook,
  handleValidationErrors,
  addBook
);

router.delete(
  "/:id",
  authenticate,
  authorizeRole("admin"),
  deleteBook
);

module.exports = router;
