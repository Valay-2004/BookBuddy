const express = require("express");
const { listBooks, addBook } = require("../controllers/book.controller");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Public route
router.get("/", listBooks);

// Protected route
router.post("/", authenticate, addBook);
module.exports = router;
