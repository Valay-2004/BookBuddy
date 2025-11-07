const express = require("express");
const { authorizeRole } = require("../middleware/auth");
const authenticate = require("../middleware/auth");
const {
  createBook,
  deleteBook,
  getAllReviews,
  deleteReview,
} = require("../controllers/admin.controller");

const router = express.Router();

// Books management
router.post("/admin/books", authenticate, authorizeRole("admin"), createBook);
router.delete(
  "/admin/books/:id",
  authenticate,
  authorizeRole("admin"),
  deleteBook
);

// Review moderation
router.get(
  "/admin/reviews",
  authenticate,
  authorizeRole("admin"),
  getAllReviews
);
router.delete(
  "/admin/reviews/:id",
  authenticate,
  authorizeRole("admin"),
  deleteReview
);

module.exports = router;
