const express = require("express");
const { authorizeRole } = require("../middleware/auth");
const authenticate = require("../middleware/auth");
const {
  getAllReviews,
  deleteReview,
} = require("../controllers/admin.controller");

const router = express.Router();

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
