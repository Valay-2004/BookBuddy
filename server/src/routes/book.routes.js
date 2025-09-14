const express = require('express');
const { listBooks } = require('../controllers/book.controller');

const router = express.Router();

router.get('/', listBooks);

module.exports = router;
