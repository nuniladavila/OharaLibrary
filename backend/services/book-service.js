
import { getBookInfoByISBN } from '../clients/google-client.js';
import { getBooksFromDb, addBookToDb } from '../clients/db.js';
import AddBookRequest from '../models/AddBookRequest.js';
import OharaBook from '../models/OharaBook.js';

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
      throw new Error('Book not found');
    }

    const oharaBookToAdd = new OharaBook(bookInfo, bookData);

    console.log('Adding book to database:', oharaBookToAdd);

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

async function deleteBookById(id) {
  try {
    const result = await deleteBookFromDb(id);
    return result;
  } catch (error) {
    console.error('Error deleting book from database:', error);
    throw error;
  }
}

export { addBookByISBN, getBooks, deleteBookById };