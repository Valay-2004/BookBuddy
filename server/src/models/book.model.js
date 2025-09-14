const db = require('../config/database');

async function getAllBooks() {
    const { rows } = await db.query('SELECT * FROM books');
    return rows;
}

module.exports = { getAllBooks };
