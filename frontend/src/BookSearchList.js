import React from 'react';

export default function BookSearchList({ books, selectedBook, setSelectedBook }) {
  if (!books || books.length === 0) return null;
  return (
    <div style={{ maxHeight: 180, overflowY: 'auto', marginTop: 8, border: '1px solid #eee', borderRadius: 8, background: '#fafafa' }}>
      {books.map(book => (
        <div
          key={book.Id || book.ISBN}
          style={{
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            borderBottom: '1px solid #eee',
            background: selectedBook && selectedBook.Id === book.Id ? '#e0e0e0' : undefined,
          }}
          onClick={() => setSelectedBook(book)}
        >
          {book.BookTitle} {book.Author ? `by ${book.Author}` : ''} {book.ISBN ? `(ISBN: ${book.ISBN})` : ''}
        </div>
      ))}
    </div>
  );
}
