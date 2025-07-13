import React, { useEffect, useState } from 'react';

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/books')
      .then(res => res.json())
      .then(data => {
        // Add a thumbnail property to each book (mock)
        const withThumbnails = data.map(book => ({
          ...book,
          thumbnail: `https://covers.openlibrary.org/b/isbn/${book.id}-M.jpg`,
        }));
        setBooks(withThumbnails);
      });
  }, []);

  // Filter books by search keyword
  const filteredBooks = books.filter(book => {
    const keyword = search.toLowerCase();
    return (
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword) ||
      String(book.year).includes(keyword)
    );
  });
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', fontFamily: 'Segoe UI, Arial', padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#3b82f6', margin: 0 }}>Welcome to Ohara Library</h1>
        <p style={{ color: '#64748b', fontSize: '1.2rem' }}>Explore our personal book inventory</p>
        <div style={{ margin: '2rem auto 0', maxWidth: 400 }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, author, or year..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '2rem',
              border: '1px solid #cbd5e1',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 1px 4px #e0e7ff',
              marginTop: '1rem',
            }}
          />
        </div>
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div key={book.id} style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 8px #e0e7ff', width: '220px', padding: '1rem', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}>
              <img src={book.thumbnail} alt={book.title} style={{ width: '120px', height: '180px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem', background: '#f1f5f9' }} onError={e => {e.target.src='https://via.placeholder.com/120x180?text=No+Cover';}} />
              <h2 style={{ fontSize: '1.1rem', color: '#334155', margin: '0.5rem 0' }}>{book.title}</h2>
              <p style={{ color: '#64748b', margin: 0 }}>{book.author}</p>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{book.year}</span>
            </div>
          ))
        ) : (
          <div style={{ color: '#64748b', fontSize: '1.2rem', marginTop: '2rem' }}>No books found.</div>
        )}
      </div>
    </div>
  );
}

export default App;
