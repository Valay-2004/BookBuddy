const { getAllBooks, createBook } = require('../models/book.model');

async function listBooks(req, res) {
    try {
        const books = await getAllBooks();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function addBook(req, res) {
    try {
        const { title, author, description } = req.body;
        const newBook = await createBook(title, author, description);
        return res.status(201).json(newBook);
    } catch (err) {
        console.error('Error adding book:', err);
        return res.status(500).json({ error: 'Failed to add book' });
    }
}
module.exports = { listBooks };
