import { getBooks, addBookByISBN } from '../services/book-service.js';

const express = require('express');
const router = express.Router();
const BOOK_ADD_PASSWORD = process.env.BOOK_ADD_PASSWORD;

// GET /api/books
router.get('/', async (req, res) => {    
  try {
    const response = await getBooks();
    if (Array.isArray(response)) {
      return res.json(response);
    } else {
      // If response is an Error object, return error details
      return res.status(500).json(response);
    }
  } catch (err) {
    console.error('Error in GET /api/books:', err);
    res.status(500).json({ error: err.message || 'Unknown error', details: err });
  }
});


// POST /api/books (password protected)
router.post('/', (req, res) => {
  const { password, ...bookData } = req.body;

  if (!password || password !== BOOK_ADD_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }

  const { ISBN, category, shelfLocation } = bookData;
  if (!ISBN || !category || !shelfLocation) {
    return res.status(400).json({ error: 'Missing required book fields' });
  }

  addBookByISBN(bookData)
    .then(result => res.status(201).json(result))
    .catch(err => {
      console.error('Error inserting book:', err);
      res.status(500).json({ error: 'Failed to add book', details: err.message });
    });
});


// PUT /api/books/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body;
  const book = books.find(b => b.id === parseInt(id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  book.title = title;
  book.author = author;
  book.year = year;
  res.json(book);
});

// DELETE /api/books/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = books.findIndex(b => b.id === parseInt(id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  const deleted = books.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;
