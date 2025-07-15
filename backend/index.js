const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

// Serve React frontend build from backend/public
app.use(express.static(path.join(__dirname, 'public')));

// Books controller router
const booksRouter = require('./controllers/booksController');
app.use('/api/books', booksRouter);

// Fallback to index.html for client-side routing
app.get(/^((?!api).)*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


const open = require('open');
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  if (typeof open === 'function') {
    open('http://localhost:4000');
  } else if (open && typeof open.default === 'function') {
    open.default('http://localhost:4000');
  }
});