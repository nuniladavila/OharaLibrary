import { getBooks, addBookByISBN, deleteBookById } from '../services/book-service.js';
import express from 'express';

const router = express.Router();

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
  console.log("Received book data:", bookData);

  if (!password || password !== process.env.ADMIN_PWD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }

  const { isbn, category, shelfLocation } = bookData;
  if (!isbn || !category || !shelfLocation) {
    return res.status(400).json({ error: 'Missing required book fields' });
  }

  addBookByISBN(bookData)
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      console.error('Error inserting book:', err);
      res.status(500).json({ error: err.message });
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

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const password = req.headers['x-admin-password'];

  if (!password || password !== process.env.ADMIN_PWD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }

  if (!id) {
    return res.status(400).json({ error: 'Book id is required' });
  }
  try {
    const result = await deleteBookById(id);
    if (result && result.changes > 0) {
      res.json({ success: true, id });
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ error: err.message || 'Failed to delete book' });
  }
});

export default router;