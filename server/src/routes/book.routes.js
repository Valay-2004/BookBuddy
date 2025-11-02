const express = require("express");
const { listBooks, addBook } = require("../controllers/book.controller");
const authenticate = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const router = express.Router();

// Public route
router.get("/", listBooks);

// Protected route
router.post("/", authenticate, authorizeRole("admin"), addBook);

module.exports = router;
