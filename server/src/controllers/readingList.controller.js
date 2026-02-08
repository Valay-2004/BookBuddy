const {
  getUserReadingLists,
  createReadingList,
  getReadingListById,
  addBookToList,
  removeBookFromList,
  getBooksInList,
} = require("../models/readingList.model");
const asyncHandler = require("../utils/asyncHandler");

const listUserReadingLists = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const lists = await getUserReadingLists(userId);
  res.json({ success: true, lists });
});

const createList = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, description, isPublic } = req.body;
  if (!name) {
    const error = new Error("List name is required.");
    error.status = 400;
    throw error;
  }
  const newList = await createReadingList(
    userId,
    name,
    description,
    isPublic
  );
  res.status(201).json(newList);
});

const getList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const list = await getReadingListById(id);
  if (!list) {
    const error = new Error("List not found.");
    error.status = 404;
    throw error;
  }
  const books = await getBooksInList(id);
  res.json({ success: true, list, books });
});

const addBook = asyncHandler(async (req, res) => {
  const { listId, bookId } = req.params;
  const added = await addBookToList(listId, bookId);
  if (added) {
    res.json({ success: true, message: "Book added to list" });
  } else {
    const error = new Error("Book already in list or not found.");
    error.status = 400;
    throw error;
  }
});

const removeBook = asyncHandler(async (req, res) => {
  const { listId, bookId } = req.params;
  const removed = await removeBookFromList(listId, bookId);
  if (removed) {
    res.json({ success: true, message: "Book removed from list" });
  } else {
    const error = new Error("Book not in list.");
    error.status = 404;
    throw error;
  }
});

module.exports = {
  listUserReadingLists,
  createList,
  getList,
  addBook,
  removeBook,
};
