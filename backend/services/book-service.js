
import { getBookInfoByISBN } from '../clients/google-client';
import { getBooksFromDb, addBookToDb } from '../clients/db';
import GoogleBook from '../models/googleBook';
import AddBookRequest from '../models/addBookRequest';

/**
 * Fetch book information from Google Books API by ISBN
 * @param {AddBookRequest} bookData - Request object containing isbn and batch props
 * @returns {Promise<Object|null>} - Book info object or null if not found
 */
async function addBookByISBN(bookData) {
  try {
    const bookInfo = await getBookInfoByISBN(bookData.isbn);

    if (!bookInfo) {
      console.error('Book not found');
      return null;
    }

    const oharaBookToAdd = new OharaBook(bookInfo, bookData);

    return await addBookToDb(oharaBookToAdd);
    
  } catch (error) {
    console.error('Error fetching book info:', error);
    throw error;
  }
}

async function getBooks() {
  try {
    const books = await getBooksFromDb();
    return books;
  } catch (error) {
    console.error('Error fetching books from database:', error);
    throw error;
  }
}

module.exports = { fetchBookInfo, getBooks };
