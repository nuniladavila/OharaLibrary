
// SQLite connection setup (ESM)
import sqlite3pkg from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3pkg.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, '../data/OharaLibrary_SQLite.db');
let db;

function connectToSqlite() {
  if (!db) {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('SQLite connection error:', err);
      } else {
        console.log('Connected to SQLite database at', dbPath);
      }
    });
  }
  return db;
}

export async function getBooksFromDb() {
  return new Promise((resolve, reject) => {
    const db = connectToSqlite();
    db.all('SELECT * FROM Books', [], (err, rows) => {
      if (err) {
        console.error('SQLite query error:', err);
        resolve({ error: err.message || 'SQLite query error', details: err });
      } else {
        resolve(rows);
      }
    });
  });
}

export function addBookToDb(book) {
  return new Promise((resolve, reject) => {
    const db = connectToSqlite();
    db.run(
      `INSERT INTO Books (
        BookTitle, Author, Editor, Category, SubCategory, Publisher, PublishedDate, Edition, Language, ShelfLocation, ISBN, Notes, Read, DateAdded, DateAcquired, ImageLink
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        book.BookTitle,
        book.Author,
        book.Editor,
        book.Category,
        book.SubCategory,
        book.Publisher,
        book.PublishedDate,
        book.Edition,
        book.Language,
        book.ShelfLocation,
        book.ISBN,
        book.Notes,
        book.Read ? 1 : 0,
        book.DateAdded,
        book.DateAcquired,
        book.ImageLink
      ],
      function(err) {
        if (err) {
          console.error('Error inserting book:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, ...book });
        }
      }
    );
  });
}

export function modifyBookInDb(book) {
  return new Promise((resolve, reject) => {
    const db = connectToSqlite();
    db.run(
      `UPDATE Books SET
        BookTitle = ?,
        Author = ?,
        Editor = ?,
        Category = ?,
        SubCategory = ?,
        Publisher = ?,
        PublishedDate = ?,
        Edition = ?,
        Language = ?,
        ShelfLocation = ?,
        ISBN = ?,
        Notes = ?,
        Read = ?,
        DateAdded = ?,
        DateAcquired = ?,
        ImageLink = ?
      WHERE id = ?`,
      [
        book.BookTitle,
        book.Author,
        book.Editor,
        book.Category,
        book.SubCategory,
        book.Publisher,
        book.PublishedDate,
        book.Edition,
        book.Language,
        book.ShelfLocation,
        book.ISBN,
        book.Notes,
        book.Read ? 1 : 0,
        book.DateAdded,
        book.DateAcquired,
        book.ImageLink,
        book.id
      ],
      function(err) {
        if (err) {
          console.error('Error updating book:', err);
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      }
    );
  });
}

export function deleteBookFromDb(id) {
  return new Promise((resolve, reject) => {
    const db = connectToSqlite();
    db.run(`DELETE FROM Books WHERE id = ?`, [id], function(err) {
      if (err) {
        console.error('Error deleting book:', err);
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
}

export { connectToSqlite }
