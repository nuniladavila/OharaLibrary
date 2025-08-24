import React, { useState, useEffect } from 'react';
import BookForm from './BookForm';
import BookSearchList from './BookSearchList';

function UpdateBook() {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch all books for search
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(() => setError('Failed to fetch books'));
  }, []);

  // Filter books by search
  const filteredBooks = books.filter(book => {
    const keyword = search.toLowerCase();
    return (
      (book.BookTitle && book.BookTitle.toLowerCase().includes(keyword)) ||
      (book.Author && book.Author.toLowerCase().includes(keyword)) ||
      (book.ISBN && String(book.ISBN).includes(keyword))
    );
  });

  // When a book is selected, set editBook state
  useEffect(() => {
    if (selectedBook) {
      setEditBook({ ...selectedBook });
    }
  }, [selectedBook]);

  const handleFieldChange = (field, value) => {
    setEditBook(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!editBook) return;
    const password = localStorage.getItem('ohara_admin_pwd') || '';
    try {
      const res = await fetch('/api/books', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ bookData: editBook }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update book');
        return;
      }
      setSuccess('Book updated successfully!');
    } catch (err) {
      setError('Network error');
    }
  };


  return (
    <div style={{ maxWidth: 600, margin: '3rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px #a084ca', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', color: '#a084ca', marginBottom: '2rem' }}>Update Book</h2>
      <div style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, author, or ISBN..."
          style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #a084ca', background: '#f3e8ff' }}
        />
        <BookSearchList
          books={filteredBooks}
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
        />
      </div>
      {editBook && (
        <BookForm
          book={editBook}
          onChange={handleFieldChange}
          onSubmit={handleSubmit}
          error={error}
          success={success}
          submitLabel="Update Book"
          readOnlyISBN={true}
        />
      )}
    </div>
  );
}

export default UpdateBook;
