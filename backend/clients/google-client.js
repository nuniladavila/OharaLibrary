
const fetch = require('node-fetch');
const GoogleBook = require('../models/googleBook');

/**
 * Fetch book information from Google Books API by ISBN
 * @param {string} isbn - The ISBN of the book
 * @returns {Promise<GoogleBook|null>} - Book info object or null if not found
 */
async function getBookInfoByISBN(isbn) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Books API error: ${response.status}`);
  }
  const data = await response.json();
  if (data.totalItems === 0 || !data.items) {
    return null;
  }
  // Return the first matching book's volumeInfo
  return data.items[0].volumeInfo;
}

module.exports = { getBookInfoByISBN };
