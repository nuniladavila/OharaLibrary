import React, { useEffect, useState } from 'react';
import BookShelf from './BookShelf';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/librarynicolilac.png';
import { COLORS } from './constants'; // Import your color constants


function HomePage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('ShelfLocation');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        const withThumbnails = data.map(book => ({
          ...book,
          thumbnail: book.ImageLink,
        }));
        setBooks(withThumbnails);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
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
    if (sortKey === 'ShelfLocation') {
      // Default: sort by shelf, then title
      const aShelf = a.ShelfLocation ?? '';
      const bShelf = b.ShelfLocation ?? '';
      const shelfCmp = sortOrder === 'asc' ? aShelf.localeCompare(bShelf) : bShelf.localeCompare(aShelf);
      if (shelfCmp !== 0) return shelfCmp;
      const aTitle = a.BookTitle ?? '';
      const bTitle = b.BookTitle ?? '';
      return sortOrder === 'asc' ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
    } else {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    }
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
      fontFamily: 'Georgia, serif',
      background: COLORS.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      position: 'relative',
    }}>
      {/* Header */}
      <header style={{ background: COLORS.header, color: COLORS.headerText, fontSize: '2.5rem', padding: '1.5rem 0 1rem 0', boxShadow: '0 2px 8px ' + COLORS.shelfShadow, textAlign: 'center', letterSpacing: 2, fontFamily: 'Georgia, serif', fontWeight: 700 }}>
        <img src={logo} alt="Ohara Library Logo" style={{ height: 60, width: 60, borderRadius: '50%', marginRight: 16, verticalAlign: 'middle', boxShadow: '0 2px 8px #e0c3fc' }} />
        Ohara Library
      </header>
      {/* Navigation Bar */}
      {/* <nav 67777777 */}
      {/* Search and sort controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, margin: '2rem auto 1.5rem', maxWidth: 900, width: '100%' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, author, or year..."
          style={{
            width: 320,
            padding: '1rem 1.5rem',
            borderRadius: '2rem',
            border: '2px solid #e0c3fc',
            fontSize: '1.1rem',
            outline: 'none',
            boxShadow: '0 2px 12px #e0c3fc',
            background: '#fff',
            color: 'black',
            fontFamily: 'Georgia, serif',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ color: COLORS.header, fontWeight: 'bold', marginRight: 4 }}>
            Sort by:
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value)}
              style={{ marginLeft: 8, padding: '0.3rem 0.7rem', borderRadius: 8, border: '1px solid #b08d57', fontSize: '1rem', fontFamily: 'Georgia, serif', color: COLORS.header }}
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
              background: COLORS.header,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.3rem 0.7rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
              boxShadow: '0 2px 8px #e0c3fc',
              fontFamily: 'Georgia, serif',
            }}
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? '▲' : '▼'}
          </button>
        </div>
      </div>
      {/* Bookshelf rows */}
      <BookShelf books={sortedBooks} COLORS={COLORS}/>
      {/* Admin icon */}
      <div style={{ position: 'fixed', top: 24, right: 32, zIndex: 10 }}>
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
            src="https://img.icons8.com/ios-filled/32/ffd580/user-shield.png"
            alt="Admin Panel"
            style={{ width: 28, height: 28, filter: 'drop-shadow(0 2px 6px #e0c3fc)' }}
          />
        </button>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1; pointer-events: auto; } }
        .book-tooltip { opacity: 0; pointer-events: none; animation: fadeIn 0.2s forwards; }
        .shelf-row { transition: box-shadow 0.3s; }
        .book-cover { transition: transform 0.2s, box-shadow 0.2s; }
        .book-cover, .shelf-row, .bookshelf-item, .spine-or-cover {
          box-shadow: 0 2px 8px #e0c3fc !important;
        }
        .book-cover:hover { z-index: 2; }
      `}</style>
    </div>
  );
}

export default HomePage;
