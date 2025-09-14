const { getAllBooks } = require('../models/book.model');

async function listBooks(req, res) {
    try {
        const books = await getAllBooks();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { listBooks };
