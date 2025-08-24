
import { getBookInfoByISBN } from '../clients/google-client.js';
import { getBooksFromDb, addBookToDb, deleteBookFromDb, modifyBookInDb, getBooksWithEmptyPageCountFromDb } from '../clients/db.js';
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
      console.warn('Book not found');
      // Do not throw, just return null
      return null;
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

export async function getBooksWithEmptyPageCount() {
  try {
    const books = await getBooksWithEmptyPageCountFromDb();
    return books;
  } catch (error) {
    console.error('Error fetching books with empty page count:', error);
    throw error;
  }
}

export async function bulkEditBooks() {
  try {
    const books = await getBooksWithEmptyPageCountFromDb();

    if (!Array.isArray(books) || books.length === 0) {
      console.warn('No books found for bulk edit');
      return [];
    } 

    console.log("count of books to edit:", books.length);
    var updatedBooks = [];

    books.forEach(async book => {
      const googleInfo = await getBookInfoByISBN(book.ISBN);

      if (googleInfo) {
        book.PageCount = googleInfo.pageCount || 0;
        book.LastUpdated = new Date();

        updatedBooks.push(await modifyBookInDb(book));
      } else {
        console.warn(`No Google info found for ISBN ${book.ISBN}`);
        return;
      }
    });
  } catch (error) {
    console.error('Error fetching books for bulk edit:', error);
    throw error;
  }
}

//Test function to add google book info to existing books
export async function addInfoToExistingBookByIsbn(isbn) {
  try {
    //TODO implement Get by isbn and by id
    const books = await getBooksFromDb();
    const bookToModify = books.find(book => book.ISBN === isbn);

    const googleInfo = await getBookInfoByISBN(isbn);

    if (!bookToModify || !googleInfo) {
      throw new Error(`Book with ISBN ${isbn} not found`);
    }

    // Update book properties
    bookToModify.PageCount = googleInfo.pageCount || 0;
    bookToModify.LastUpdated = new Date();

    // Save updated book to database
    return await modifyBookInDb(bookToModify);
  } catch (error) {
    console.error('Error modifying book:', error);
    throw error;
  }
}

async function modifyBookByIsbn(bookData) {
  try {
    //TODO implement Get by isbn and by id
    const books = await getBooksFromDb();
    const bookToModify = books.find(book => book.ISBN === bookData.ISBN);

    if (!bookToModify) {
      throw new Error(`Book with ISBN ${bookData.ISBN} not found`);
    }

    console.log('original book:', bookToModify);

    // Update book properties
    Object.assign(bookToModify, bookData);
    bookToModify.LastUpdated = new Date();

    console.log('Modified book:', bookToModify);

    // Save updated book to database
    return await modifyBookInDb(bookToModify);
  } catch (error) {
    console.error('Error modifying book:', error);
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