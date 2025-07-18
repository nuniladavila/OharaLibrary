import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/librarynicolilac.png';

function HomePage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched books:", data);
        const withThumbnails = data.map(book => ({
          ...book,
          thumbnail: book.ImageLink,
        }));
        setBooks(withThumbnails);
      })
      .catch(error => {
        console.error('Oh no Error fetching books:', error);
      });
  }, []);

  const filteredBooks = Array.isArray(books) ? books.filter(book => {
    const keyword = search.toLowerCase();
    return (
      (book.BookTitle && book.BookTitle.toLowerCase().includes(keyword)) ||
      (book.Author && book.Author.toLowerCase().includes(keyword)) ||
      (book.PublishedDate && String(book.PublishedDate).includes(keyword))
    );
  }) : [];

  const handleAdminClick = async () => {
    const password = window.prompt('Enter admin password:');
    if (!password) return;
    localStorage.setItem('ohara_admin_pwd', password);
    navigate('/admin-panel');
  };

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'Segoe UI, Arial',
      padding: '2rem',
      background: 'linear-gradient(135deg, coral 0%, #ffb199 50%, #ffd6cc 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      {/* Admin icon */}
      <div style={{ position: 'absolute', top: 24, right: 32, zIndex: 10 }}>
        <button
          onClick={handleAdminClick}
          title="Admin Panel"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            outline: 'none',
          }}
        >
          <img
            src="https://img.icons8.com/ios-filled/32/ffffff/user-shield.png"
            alt="Admin Panel"
            style={{ width: 28, height: 28, filter: 'drop-shadow(0 2px 6px coral)' }}
          />
        </button>
      </div>
      {/* Pattern background removed for a cleaner, more modern look */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '50%',
            boxShadow: '0 6px 32px 0 rgba(255,127,80,0.25), 0 2px 8px coral',
            padding: '0.1rem',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 170,
            height: 170,
          }}>
            <img src={logo} alt="Ohara Library Logo" style={{ height: '150px', width: '150px', borderRadius: '50%', boxShadow: '0 2px 16px coral', background: 'transparent', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: '3rem', color: '#fff', margin: 0, textShadow: '2px 2px 12px coral' }}>Welcome to Ohara Library</h1>
        </div>
        {/* <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', textShadow: '1px 1px 8px coral', marginBottom: '1.5rem' }}>Explore our personal book inventory</p> */}
        <div style={{ margin: '2rem auto 0', maxWidth: 400 }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, author, or year..."
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              borderRadius: '2rem',
              border: '2px solid coral',
              fontSize: '1.1rem',
              outline: 'none',
              boxShadow: '0 2px 12px coral',
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

export default HomePage;
