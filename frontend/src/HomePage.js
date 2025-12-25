import React, { useEffect, useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Input, Dropdown, Button, ButtonOr, Icon, Image } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { COLORS, COOL_FONTS } from './constants'; // Import your color constants


function HomePage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('ShelfLocation');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    // Keep fetching books in case other parts of the app rely on them (admin, counts, etc.)
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data || []))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const filteredBooks = Array.isArray(books) ? books.filter(book => {
    const keyword = search.toLowerCase();
    return (
      (book.BookTitle && book.BookTitle.toLowerCase().includes(keyword)) ||
      (book.Author && book.Author.toLowerCase().includes(keyword)) ||
      (book.PublishedDate && String(book.PublishedDate).includes(keyword))
    );
  }) : [];

  // Sorting (kept for compatibility, results are not shown on homepage per design)
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortKey === 'ShelfLocation') {
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
    <>
      <div style={{
        minHeight: '100vh',
        fontFamily: 'Georgia, serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center', // center vertically
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        background: COLORS.background
      }}>
        {/* Absolutely centered box, animates upward when searching */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            width: '100%',
            maxWidth: 960,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 3,
            top: search && search.trim().length > 0 ? '7%' : '50%',
            transform: search && search.trim().length > 0 ? 'translate(-50%, 0)' : 'translate(-50%, -50%)',
            transition: 'top 0.7s cubic-bezier(.4,1.4,.6,1), transform 0.7s cubic-bezier(.4,1.4,.6,1)',
          }}
        >
          <span
            style={{
              ...COOL_FONTS['uncial-antiqua-regular'],
              fontSize: '4.5rem',
              color: COLORS.accentColor,
              fontWeight: 400,
              letterSpacing: 2,
              display: 'flex',
              lineHeight: 0.8,
              wordBreak: 'break-word',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              background: 'none',
              boxShadow: 'none',
              marginTop: '1rem'
            }}
          >
            Ohara Library
          </span>
          {/* Centered search + filters card */}
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
          }}>
            <div style={{ width: 'min(900px, 95%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 12, background: 'rgba(255,255,255,0.85)', boxShadow: '0 6px 24px rgba(36,37,38,0.12)', display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Input
                  icon={<Icon name='search'/>}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by title, author, or year..."
                  style={{ minWidth: 240, maxWidth: 520, flex: '1 1 320px' }}
                />
                <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Dropdown
                    selection
                    value={sortKey}
                    onChange={(e, { value }) => setSortKey(value)}
                    options={[{ key: 'BookTitle', value: 'BookTitle', text: 'Title' },{ key: 'Author', value: 'Author', text: 'Author' },{ key: 'PublishedDate', value: 'PublishedDate', text: 'Published Date' },{ key: 'Category', value: 'Category', text: 'Category' },{ key: 'ShelfLocation', value: 'ShelfLocation', text: 'Shelf Location' },]}
                    style={{ marginLeft: 8, minWidth: 120, maxWidth: 180 }}
                  />
                  <Button.Group size="small" style={{ marginLeft: 4 }}>
                    <Button
                      active={sortOrder === 'asc'}
                      color={sortOrder === 'asc' ? 'orange' : null}
                      onClick={() => setSortOrder('asc')}
                    >
                      asc
                    </Button>
                    <ButtonOr />
                    <Button
                      active={sortOrder === 'desc'}
                      color={sortOrder === 'desc' ? 'orange' : null}
                      onClick={() => setSortOrder('desc')}
                    >
                      desc
                    </Button>
                  </Button.Group>
                </div>
              </div>
            </div>
          </div>
          {/* Total book count statistic below the search bar */}
          <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '1rem', fontWeight: 600, color: COLORS.accentColor }}>
            Total Books: {books.length}
          </div>
        </div>

        {/* Search results */}

        <div style={{ width: '95%', maxHeight: '70%', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', padding: 8, background: 'transparent' }}>
          {search && search.trim().length > 0 && sortedBooks.length > 0 ? (
            sortedBooks.map(book => (
              <div key={book.Id ?? book.id ?? book.ISBN ?? Math.random()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100 }}>
                <Image
                  src={book.ImageLink || book.thumbnail || `https://placehold.co/110x170?text=${encodeURIComponent(book.BookTitle || 'Book')}`}
                  style={{ width: 100, height: 150, borderRadius: 4, objectFit: 'cover' }}
                  alt={book.BookTitle}
                />
              </div>
            ))
          ) : search && search.trim().length > 0 ? (
            <div style={{ color: COLORS.accentColor, fontSize: '1rem', marginTop: '0.5rem', fontWeight: 600 }}>No books found.</div>
          ) : null}
        </div>

        {/* Admin icon */}
        <Icon link name='lemon' className="lemon-icon" onClick={handleAdminClick} style={{ position: "absolute", right: "1.25rem", top: "1.25rem", color:COLORS.accentColor, zIndex: 2 }}/>
        <style>{`
          @media (max-width: 600px) {
            .hide-on-mobile {
              display: none !important;
            }
            .lemon-icon {
              right: 2.25rem !important;
            }
          }
        `}</style>

        <style>{`
          @media (max-width: 600px) {
            .hide-on-mobile {
              display: none !important;
            }
          }
        `}</style>
          
        <style>{`
          @keyframes fadeIn { to { opacity: 1; pointer-events: auto; } }
          .book-cover { transition: transform 0.2s; }
          .book-cover:hover { z-index: 2; }
        `}</style>
      </div>
    </>
  );
}

export default HomePage;
