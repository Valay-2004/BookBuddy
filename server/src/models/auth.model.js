const db = require('../config/database');

async function findUserByEmail(email) {
    const { rows } = await db.query(
        'SELECT * FROM users WHERE email=$1',
        [email]
    );
    return rows[0];
}


async function createUser({name, email, passwordHash, role = 'user' }) {
    const { rows } = await db.query(
        `INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role`,
        [name, email, passwordHash, role]
    );
    return rows[0];
}

module.exports = { findUserByEmail, createUser };
