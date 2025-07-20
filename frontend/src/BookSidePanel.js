import React from 'react';

function BookSidePanel({ book, onClose }) {
  if (!book) return null;

  // Ensure correct date parsing for numeric string or float values
  const parseDate = val => {
    if (!val) return null;
    // If already a number, or a string that looks like a number, treat as ms
    if (!isNaN(val)) return new Date(Number(val));
    // Otherwise, try to parse as date string
    return new Date(val);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '400px',
        background: '#fff',
        boxShadow: '-8px 0 32px #a084ca', // lilac purple
        zIndex: 100,
        padding: '2.5rem 2rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        transition: 'transform 0.3s',
        borderTopLeftRadius: '2rem',
        borderBottomLeftRadius: '2rem',
      }}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        style={{
          alignSelf: 'flex-end',
          background: 'none',
          border: 'none',
          fontSize: '2rem',
        color: '#a084ca',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
        aria-label="Close details"
      >
        &times;
      </button>
      <img
        src={book.thumbnail}
        alt={book.BookTitle}
        style={{ width: '180px', height: '260px', objectFit: 'cover', borderRadius: '1rem', margin: '0 auto 1.5rem', background: '#f3e8ff', border: '2px solid #a084ca', boxShadow: '0 2px 12px #a084ca' }}
        onError={e => {e.target.src='https://via.placeholder.com/180x260?text=No+Cover';}}
      />
      <h2 style={{ color: '#a084ca', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>{book.BookTitle}</h2>
      <p style={{ color: '#333', fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>{book.Author}</p>
      <div style={{ color: '#7c5e99', fontSize: '1rem', marginBottom: 12, textAlign: 'center' }}>
        {book.PublishedDate ? (parseDate(book.PublishedDate)?.toLocaleDateString?.() || '') : ''}
      </div>
      <div style={{ marginBottom: 12 }}>
        <strong style={{ color: '#a084ca' }}>Category:</strong> {book.Category || '—'}<br />
        <strong style={{ color: '#a084ca' }}>Subcategory:</strong> {book.SubCategory || '—'}<br />
        <strong style={{ color: '#a084ca' }}>Shelf:</strong> {book.ShelfLocation || '—'}<br />
        <strong style={{ color: '#a084ca' }}>ISBN:</strong> {book.ISBN || '—'}<br />
        <strong style={{ color: '#a084ca' }}>Language:</strong> {book.Language || '—'}<br />
        <strong style={{ color: '#a084ca' }}>Publisher:</strong> {book.Publisher || '—'}<br />
        <strong style={{ color: '#a084ca' }}>Edition:</strong> {book.Edition || '—'}<br />
        <strong style={{ color: '#a084ca' }}>Read:</strong> {book.Read == 0 ? 'No' : 'Yes'}<br />
        <strong style={{ color: '#a084ca' }}>Date Added:</strong> {book.DateAdded ? (parseDate(book.DateAdded)?.toLocaleDateString?.() || '—') : '—'}<br />
        <strong style={{ color: '#a084ca' }}>Date Acquired:</strong> {book.DateAcquired ? (parseDate(book.DateAcquired)?.toLocaleDateString?.() || '—') : '—'}<br />
      </div>
      {book.Editor && (
        <div style={{ marginBottom: 12 }}>
        <strong style={{ color: '#a084ca' }}>Editor:</strong> {book.Editor}
        </div>
      )}
      {book.Notes && (
        <div style={{ marginBottom: 12 }}>
          <strong style={{ color: '#a084ca' }}>Notes:</strong>
          <div style={{ color: '#444', fontStyle: 'italic', marginTop: 4 }}>{book.Notes}</div>
        </div>
      )}
    </div>
  );
}

export default BookSidePanel;
