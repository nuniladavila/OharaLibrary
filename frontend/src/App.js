import React, { useEffect, useState } from 'react';
import logo from '../assets/librarynicolilac.png';

function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched books:", data);
        // Add a thumbnail property to each book (mock)
        const withThumbnails = data.map(book => ({
          ...book,
          thumbnail: book.imageLink,
          // thumbnail: `https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg`,
        }));
        setBooks(withThumbnails);
      })
      .catch(error => {
        console.error('Oh no Error fetching books:', error);
      });
  }, []);

  // Filter books by search keyword
  const filteredBooks = books.filter(book => {
    const keyword = search.toLowerCase();
    return (
      (book.BookTitle && book.BookTitle.toLowerCase().includes(keyword)) ||
      (book.Author && book.Author.toLowerCase().includes(keyword)) ||
      (book.PublishedDate && String(book.PublishedDate).includes(keyword))
    );
  });
  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'Segoe UI, Arial',
      padding: '2rem',
      background: 'linear-gradient(135deg, coral 0%, #ffb199 50%, #ffd6cc 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Fun pattern overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.15,
        backgroundImage: 'repeating-radial-gradient(circle at 20% 20%, #fff 0px, #fff 2px, transparent 3px, transparent 40px), repeating-radial-gradient(circle at 80% 80%, #fff 0px, #fff 2px, transparent 3px, transparent 40px)'
      }} />
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <img src={logo} alt="Ohara Library Logo" style={{ height: '56px', width: '56px', borderRadius: '12px', boxShadow: '0 2px 8px coral', background: '#fff' }} />
          <h1 style={{ fontSize: '2.5rem', color: '#fff', margin: 0, textShadow: '2px 2px 8px coral' }}>Welcome to Ohara Library</h1>
        </div>
        <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', textShadow: '1px 1px 6px coral' }}>Explore our personal book inventory</p>
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
              border: '2px solid coral',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 2px 8px coral',
              marginTop: '1rem',
              background: '#fff',
              color: '#333',
            }}
          />
        </div>
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div key={book.Id} style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 4px 16px coral', width: '220px', padding: '1rem', textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer', border: '2px solid coral' }}>
              <img src={book.thumbnail} alt={book.BookTitle} style={{ width: '120px', height: '180px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem', background: '#ffe5dd', border: '2px solid coral' }} onError={e => {e.target.src='https://via.placeholder.com/120x180?text=No+Cover';}} />
              <h2 style={{ fontSize: '1.1rem', color: 'coral', margin: '0.5rem 0', fontWeight: 'bold' }}>{book.BookTitle}</h2>
              <p style={{ color: '#333', margin: 0 }}>{book.Author}</p>
              <span style={{ color: 'coral', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {book.PublishedDate ? new Date(book.PublishedDate).toISOString().slice(0, 10) : ''}
              </span>
            </div>
          ))
        ) : (
          <div style={{ color: '#fff', fontSize: '1.2rem', marginTop: '2rem', fontWeight: 'bold', textShadow: '1px 1px 6px coral' }}>No books found.</div>
        )}
      </div>
    </div>
  );
}

export default App;
