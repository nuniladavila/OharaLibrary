// SQLite connection setup
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

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

async function getBooksFromDb() {
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

module.exports = { getBooksFromDb, connectToSqlite };
