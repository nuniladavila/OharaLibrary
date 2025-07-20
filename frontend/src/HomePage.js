import React, { useEffect, useState } from 'react';
import BookSidePanel from './BookSidePanel';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/librarynicolilac.png';

function HomePage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [sortKey, setSortKey] = useState('BookTitle');
  const [sortOrder, setSortOrder] = useState('asc');
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

  // Sorting
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const aVal = a[sortKey] ?? '';
    const bVal = b[sortKey] ?? '';
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

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
      background: 'linear-gradient(90deg, #a084ca 0%, #e0c3fc 50%, #f3e8ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: selectedBook ? 'hidden' : 'auto',
      position: 'relative',
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
            style={{ width: 28, height: 28, filter: 'drop-shadow(0 2px 6px #a084ca)' }}
          />
        </button>
      </div>
      {/* Pattern background removed for a cleaner, more modern look */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem', width: '100%' }}>
        {/* Logo and title at the top, centered */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            background: 'rgba(255,255,255,0.92)',
            borderRadius: '50%',
            boxShadow: '0 6px 32px 0 #e0c3fc, 0 2px 8px #a084ca',
            padding: '0.1rem',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 170,
            height: 170,
          }}>
            <img src={logo} alt="Ohara Library Logo" style={{ height: '150px', width: '150px', borderRadius: '50%', boxShadow: '0 2px 16px #a084ca', background: 'transparent', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: '3rem', margin: 0, color: 'white', textShadow: '2px 2px 12px #e0c3fc' }}>Welcome to Ohara Library</h1>
        </div>
        {/* Search and sorting controls below logo/title, centered */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          margin: '0 auto 1.5rem',
          width: '100%',
        }}>
          <div style={{ flex: 1, maxWidth: 400 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, author, or year..."
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                borderRadius: '2rem',
              border: '2px solid #a084ca',
                fontSize: '1.1rem',
                outline: 'none',
              boxShadow: '0 2px 12px #a084ca',
                background: '#fff',
                color: '#333',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ color: 'white', fontWeight: 'bold', marginRight: 4 }}>
              Sort by:
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value)}
                style={{ marginLeft: 8, padding: '0.3rem 0.7rem', borderRadius: 8, border: '1px solid #a084ca', fontSize: '1rem' }}
              >
                <option value="BookTitle">Title</option>
                <option value="Author">Author</option>
                <option value="PublishedDate">Published Date</option>
                <option value="Category">Category</option>
                <option value="ShelfLocation">Shelf Location</option>
                <option value="ISBN">ISBN</option>
                <option value="Language">Language</option>
                <option value="Publisher">Publisher</option>
                <option value="Edition">Edition</option>
                <option value="Read">Read</option>
                <option value="DateAdded">Date Added</option>
                <option value="DateAcquired">Date Acquired</option>
                <option value="SubCategory">Subcategory</option>
                <option value="Editor">Editor</option>
              </select>
            </label>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{
                marginLeft: 4,
                background: '#a084ca',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '0.3rem 0.7rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 2px 8px #a084ca',
              }}
              title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            >
              {sortOrder === 'asc' ? '▲' : '▼'}
            </button>
          </div>
        </div>
        {/* <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', textShadow: '1px 1px 8px coral', marginBottom: '1.5rem' }}>Explore our personal book inventory</p> */}
        {/* ...search bar moved above, replaced by nothing here... */}
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
        {sortedBooks.length > 0 ? (
          sortedBooks.map(book => (
            <div
              key={book.Id}
              style={{
                background: '#fff',
                borderRadius: '1rem',
                boxShadow: '0 4px 16px #a084ca',
                width: '220px',
                padding: '1rem',
                textAlign: 'center',
                transition: 'transform 0.2s',
                cursor: 'pointer',
                border: '2px solid #a084ca',
                position: 'relative',
                zIndex: 1,
              }}
              onClick={() => setSelectedBook(book)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedBook(book); }}
              aria-label={`View details for ${book.BookTitle}`}
            >
              <img src={book.thumbnail} alt={book.BookTitle} style={{ width: '120px', height: '180px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem', background: '#f3e8ff', border: '2px solid #a084ca' }} onError={e => {e.target.src='https://via.placeholder.com/120x180?text=No+Cover';}} />
              <h2 style={{ fontSize: '1.1rem', color: '#a084ca', margin: '0.5rem 0', fontWeight: 'bold' }}>{book.BookTitle}</h2>
              <p style={{ color: '#333', margin: 0 }}>{book.Author}</p>
              <span style={{ color: '#a084ca', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {book.PublishedDate ? new Date(book.PublishedDate).toISOString().slice(0, 10) : ''}
              </span>
            </div>
          ))
        ) : (
          <div style={{ color: '#a084ca', fontSize: '1.2rem', marginTop: '2rem', fontWeight: 'bold', textShadow: '1px 1px 6px #e0c3fc' }}>No books found.</div>
        )}
      </div>

      {/* Side pane for book details */}
      <BookSidePanel book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}

export default HomePage;
