import React, { useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Input, Dropdown, Button, ButtonOr } from 'semantic-ui-react';
import BookShelf from './BookShelf';
import { useNavigate } from 'react-router-dom';
import { COLORS, COOL_FONTS } from './constants'; // Import your color constants


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
      background: 'linear-gradient(120deg, #d16ba5 0%, #86a8e7 50%, #5ffbf1 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Abstract SVG background */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d16ba5" />
            <stop offset="0.5" stopColor="#86a8e7" />
            <stop offset="1" stopColor="#5ffbf1" />
          </linearGradient>
        </defs>
      </svg>
      {/* Header */}
      <header style={{
        background: 'transparent',
        color: COLORS.headerText,
        fontSize: '4.5rem',
        padding: '1.5rem 0 1rem 0',
        textAlign: 'center',
        letterSpacing: 2,
        fontFamily: 'Uncial Antiqua, system-ui',
        fontWeight: 400,
        borderBottom: 'none',
        transition: 'background 0.3s',
      }}>
        {/* <img src={logo} alt="Ohara Library Logo" style={{ height: 100, width: 100, borderRadius: '50%', marginRight: 16, verticalAlign: 'middle', background: 'rgba(255,255,255,0.7)' }} /> */}
        {/* <p style={COOL_FONTS['fleur-de-leah']}>Ohara Library</p>
        <p style={COOL_FONTS['rye']}>Ohara Library</p> */}
        {/* <p style={COOL_FONTS['uncial-antiqua-regular']}>Ohara Library</p> */}
      </header>
      {/* Search and sort controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, margin: '2rem auto 1.5rem', maxWidth: 900, width: '100%' }}>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, author, or year..."
          style={{ width: 320 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ color: COLORS.headerText, fontWeight: 'bold', marginRight: 4 }}>
            Sort by:
            <Dropdown
              selection
              value={sortKey}
              onChange={(e, { value }) => setSortKey(value)}
              options={[
                { key: 'BookTitle', value: 'BookTitle', text: 'Title' },
                { key: 'Author', value: 'Author', text: 'Author' },
                { key: 'PublishedDate', value: 'PublishedDate', text: 'Published Date' },
                { key: 'Category', value: 'Category', text: 'Category' },
                { key: 'ShelfLocation', value: 'ShelfLocation', text: 'Shelf Location' },
                { key: 'ISBN', value: 'ISBN', text: 'ISBN' },
                { key: 'Language', value: 'Language', text: 'Language' },
                { key: 'Publisher', value: 'Publisher', text: 'Publisher' },
                { key: 'Edition', value: 'Edition', text: 'Edition' },
                { key: 'Read', value: 'Read', text: 'Read' },
                { key: 'DateAdded', value: 'DateAdded', text: 'Date Added' },
                { key: 'DateAcquired', value: 'DateAcquired', text: 'Date Acquired' },
                { key: 'SubCategory', value: 'SubCategory', text: 'Subcategory' },
                { key: 'Editor', value: 'Editor', text: 'Editor' },
              ]}
              style={{ marginLeft: 8, minWidth: 180 }}
            />
          </label>
          <Button.Group size="small" style={{ marginLeft: 4 }}>
            <Button
              active={sortOrder === 'asc'}
              color={sortOrder === 'asc' ? 'purple' : null}
              onClick={() => setSortOrder('asc')}
            >
              asc
            </Button>
            <ButtonOr />
            <Button
              active={sortOrder === 'desc'}
              color={sortOrder === 'desc' ? 'purple' : null}
              onClick={() => setSortOrder('desc')}
            >
              desc
            </Button>
          </Button.Group>
        </div>
      </div>
      {/* Bookshelf rows */}
      <BookShelf books={sortedBooks} COLORS={COLORS}/>
      {/* Animations */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1; pointer-events: auto; } }
        .book-cover { transition: transform 0.2s; }
        .book-cover:hover { z-index: 2; }
      `}</style>
      
      {/* Admin controls at the bottom */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'static', bottom: 0, left: 0, padding: '1.5rem 2.5rem 1.5rem 0', boxSizing: 'border-box' }}>
        <button
          onClick={handleAdminClick}
          title="Admin Panel"
          style={{
            background: 'none',
            border: 'none',
            color: COLORS.headerText,
            fontWeight: 'bold',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontFamily: 'Georgia, serif',
          }}
        >
          Admin controls
        </button>
      </div>
    </div>
  );
}

export default HomePage;
