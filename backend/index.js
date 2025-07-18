import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import booksRouter from './controllers/booksController.js';
import open from 'open';

const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve React frontend build from backend/public
app.use(express.static(path.join(__dirname, 'public')));

// Books controller router
app.use('/api/books', booksRouter);

// Fallback to index.html for client-side routing
app.get(/^((?!api).)*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  if (typeof open === 'function') {
    open('http://localhost:4000');
  } else if (open && typeof open.default === 'function') {
    open.default('http://localhost:4000');
  }
});