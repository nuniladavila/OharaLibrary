const express = require('express');
const router = express.Router();
const { getBooksFromDb } = require('../db');

// Mock book inventory
let books = [
  { id: 1, title: 'The Great Goat', author: 'F. Scott Fitzgerald', year: 1925 },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
  { id: 3, title: '1984', author: 'George Orwell', year: 1949 },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813 },
  { id: 5, title: 'Moby-Dick', author: 'Herman Melville', year: 1851 }
];

// GET /api/books
router.get('/', async (req, res) => {    
  try {
    const dbBooks = await getBooksFromDb();
    if (Array.isArray(dbBooks)) {
      return res.json(dbBooks);
    } else if (dbBooks && dbBooks instanceof Error) {
      // If dbBooks is an Error object, return error details
      return res.status(500).json({ error: dbBooks.message || 'Database error', details: dbBooks });
    } else if (dbBooks && dbBooks.error) {
      // If dbBooks is an error object
      return res.status(500).json(dbBooks);
    }
    // Fallback to mock books if no DB books
    res.json(books);
  } catch (err) {
    console.error('Error in GET /api/books:', err);
    res.status(500).json({ error: err.message || 'Unknown error', details: err });
  }
});

// POST /api/books
router.post('/', (req, res) => {
  const { title, author, year } = req.body;
  const newBook = {
    id: books.length + 1,
    title,
    author,
    year
  };
  books.push(newBook);
  res.status(201).json(newBook);
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
