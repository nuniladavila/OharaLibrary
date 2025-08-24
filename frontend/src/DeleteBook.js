import React, { useState, useEffect } from 'react';
import BookSearchList from './BookSearchList';

export default function DeleteBook() {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(() => setError('Failed to fetch books'));
  }, []);

  const filteredBooks = books.filter(book => {
    const keyword = search.toLowerCase();
    return (
      (book.BookTitle && book.BookTitle.toLowerCase().includes(keyword)) ||
      (book.Author && book.Author.toLowerCase().includes(keyword)) ||
      (book.ISBN && String(book.ISBN).includes(keyword))
    );
  });

  const handleDelete = async () => {
    if (!selectedBook) return;
    setError('');
    setSuccess('');
    const password = localStorage.getItem('ohara_admin_pwd') || '';
    try {
      const res = await fetch(`/api/books/${selectedBook.Id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': password,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete book');
        return;
      }
      setSuccess('Book deleted successfully!');
      setSelectedBook(null);
      setBooks(books.filter(b => b.Id !== selectedBook.Id));
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '3rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px #a084ca', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', color: '#a084ca', marginBottom: '2rem' }}>Delete Book</h2>
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
      {selectedBook && (
        <div style={{ marginBottom: 16, padding: '1rem', background: '#f3e8ff', borderRadius: 8 }}>
          <strong>Selected Book:</strong><br />
          Title: {selectedBook.BookTitle}<br />
          Author: {selectedBook.Author}<br />
          ISBN: {selectedBook.ISBN}<br />
        </div>
      )}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <button
        onClick={handleDelete}
        disabled={!selectedBook}
        style={{ width: '100%', padding: '0.75rem', borderRadius: 8, background: '#d7263d', color: '#fff', fontWeight: 'bold', border: 'none', fontSize: '1.1rem', cursor: selectedBook ? 'pointer' : 'not-allowed', boxShadow: '0 2px 8px #a084ca', marginTop: 8 }}
      >
        Delete Book
      </button>
    </div>
  );
}
