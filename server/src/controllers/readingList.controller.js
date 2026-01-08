const {
  getUserReadingLists,
  createReadingList,
  getReadingListById,
  addBookToList,
  removeBookFromList,
  getBooksInList,
} = require("../models/readingList.model");

async function listUserReadingLists(req, res) {
  try {
    const userId = req.user.id;
    const lists = await getUserReadingLists(userId);
    res.json({ success: true, lists });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createList(req, res) {
  try {
    const userId = req.user.id;
    const { name, description, isPublic } = req.body;
    const newList = await createReadingList(
      userId,
      name,
      description,
      isPublic
    );
    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ error: "Failed to create list" });
  }
}

async function getList(req, res) {
  try {
    const { id } = req.params;
    const list = await getReadingListById(id);
    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }
    const books = await getBooksInList(id);
    res.json({ success: true, list, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addBook(req, res) {
  try {
    const { listId, bookId } = req.params;
    const added = await addBookToList(listId, bookId);
    if (added) {
      res.json({ success: true, message: "Book added to list" });
    } else {
      res.status(400).json({ error: "Book already in list or not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to add book" });
  }
}

async function removeBook(req, res) {
  try {
    const { listId, bookId } = req.params;
    const removed = await removeBookFromList(listId, bookId);
    if (removed) {
      res.json({ success: true, message: "Book removed from list" });
    } else {
      res.status(404).json({ error: "Book not in list" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to remove book" });
  }
}

module.exports = {
  listUserReadingLists,
  createList,
  getList,
  addBook,
  removeBook,
};
