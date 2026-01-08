const express = require("express");
const router = express.Router();
const {
  listUserReadingLists,
  createList,
  getList,
  addBook,
  removeBook,
} = require("../controllers/readingList.controller");
const authenticate = require("../middleware/auth");

// All routes require authentication
router.use(authenticate);

router.get("/", listUserReadingLists);
router.post("/", createList);
router.get("/:id", getList);
router.post("/:listId/books/:bookId", addBook);
router.delete("/:listId/books/:bookId", removeBook);

module.exports = router;
