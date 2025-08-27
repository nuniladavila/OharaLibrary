import React, { useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Input, Dropdown, Button, ButtonOr, Grid, Image } from 'semantic-ui-react';
// import BookShelf from './BookShelf';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/librarynicolilac.png';
import { COLORS, COOL_FONTS } from './constants'; // Import your color constants
import BookShelfItem from './BookShelfItem';


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
      background: 'rgb(195, 75, 25)',
      // background: 'linear-gradient(120deg, #4b2e09 0%, #7c5a2a 50%, #a0844a 100%)', // dark brown tones
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header */}
  <div style={{ width: '100vw', paddingTop: '0', paddingBottom: '0', position: 'relative', zIndex: 1, height: 250, overflow: 'hidden' }}>
    {/* SVG with image fill for organic curve */}
    <svg
      viewBox="0 0 1920 250"
      width="100vw"
      height="250"
      style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: 250, zIndex: 1 }}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="bannerPattern" patternUnits="userSpaceOnUse" width="1920" height="250">
          <image href={require('../assets/oharalibrarybanner.png')} x="0" y="0" width="1920" height="250" preserveAspectRatio="xMidYMid slice" />
        </pattern>
      </defs>
      <path
        d="M0,0 H1920 V180 Q1600,250 1200,220 Q900,200 600,240 Q300,260 0,180 Z"
        fill="url(#bannerPattern)"
      />
    </svg>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -40%)',
      width: '100%',
      textAlign: 'center',
      zIndex: 2,
      pointerEvents: 'none',
    }}>
      <span style={{
        ...COOL_FONTS['uncial-antiqua-regular'],
        fontSize: '4.5rem',
        color: COLORS.headerText,
        fontWeight: 400,
        letterSpacing: 2,
        textShadow: '0 2px 8px #a084ca88',
        borderRadius: 8,
        padding: '0.5rem 2rem',
        marginTop: '-2rem',
        display: 'inline-block',
        zIndex: 2
      }}>
        Ohara Library
      </span>
    </div>
  </div>
      {/* Search and sort controls in a single row */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, margin: '2rem auto 2rem auto', width: '100%' }}>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, author, or year..."
          style={{ width: 320 }}
        />
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
        
      {/* Total book count statistic */}
      <div style={{ textAlign: 'center', margin: '1rem 0', fontSize: '1.3rem', fontWeight: 600, color: COLORS.headerText }}>
        Total Books: {books.length}
      </div>
      {/* Book rows using Semantic UI Grid, only images, closer together, with placeholder */}
      <div style={{ width: '100%', margin: '1rem 0', padding:'0 1rem' }}>
        {sortedBooks.length > 0 ? (
          <Grid doubling stackable columns={10} centered style={{ rowGap: '0.25rem' }}>
            {sortedBooks.map(book => (
              <Grid.Column key={book.Id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <BookShelfItem title={book.BookTitle} coverImage={book.thumbnail} fontFamily={'Georgia, serif'}/> 
              </Grid.Column>
            ))}
          </Grid>
        ) : (
          <div style={{ color: COLORS.headerText, fontSize: '1.2rem', marginTop: '2rem', fontWeight: 'bold', textShadow: '1px 1px 6px #e0c3fc' }}>No books found.</div>
        )}
      </div>
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
