import { modifyBookInDb } from '../clients/db.js';
import { getBooks, addBookByISBN, deleteBookById, addInfoToExistingBookByIsbn, bulkEditBooks } from '../services/book-service.js';
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
  const { bookData } = req.body;
  const password = req.headers['x-admin-password'];
  const inputMode = req.headers['x-input-mode'];

  console.log("Received book data:", bookData);

  if (!password || password !== process.env.ADMIN_PWD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }

  const { ISBN, Category, ShelfLocation } = bookData;
  if (!ISBN || !Category || !ShelfLocation) {
    return res.status(400).json({ error: 'Missing required book fields' });
  }

  const isManualMode = inputMode == "Manual";
  addBookByISBN(bookData, isManualMode)
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      console.error('Error inserting book:', err);
      res.status(500).json({ error: err.message });
    });
});

// PUT /api/books/bulkedit
router.put('/bulkedit', (req, res) => {
  const password = req.headers['x-admin-password'];

  console.log("Received bulk edit request");

  if (!password || password !== process.env.ADMIN_PWD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }

  bulkEditBooks()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error('Error adding book Google info:', err);
      res.status(500).json({ error: err.message });
    });
});

// PUT /api/books/:isbn
router.put('/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { bookData } = req.body;
  const password = req.headers['x-admin-password'];

  if (!password || password !== process.env.ADMIN_PWD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }

  if (!isbn) {
    return res.status(400).json({ error: 'ISBN is required' });
  }

  modifyBookInDb(bookData)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.error('Error modifying book:', err);
      res.status(500).json({ error: err.message });
    });
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