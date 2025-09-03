import React, { useEffect, useState, useRef } from 'react';
import WAVES from 'vanta/dist/vanta.waves.min';
import FOG from 'vanta/dist/vanta.fog.min';
import TRUNK from 'vanta/dist/vanta.trunk.min';
import * as THREE from 'three';
import p5 from 'p5';
import 'semantic-ui-css/semantic.min.css';
import { Input, Dropdown, Button, ButtonOr, Grid, Image, Card, Icon } from 'semantic-ui-react';
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
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

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

  // Vanta.js background setup
  useEffect(() => {
    if (!vantaEffectRef.current) {
      vantaEffectRef.current = FOG({
        el: vantaRef.current,
        THREE,    
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        // highlightColor: 0xf2c443,
        // midtoneColor: 0xcf4d43,
        // lowlightColor: 0x6f63bb,
        // baseColor: 0xf5e0e0,
        speed: 1.50
        // zoom: 0.85,
      });
    }
    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
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
    <>
      <div ref={vantaRef} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        midtoneColor: "#ff7043"

      }} />
      <div style={{
        minHeight: '100vh',
        fontFamily: 'Georgia, serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
      }}>
        {/* Admin icon */}
        <Icon link name='lemon' className="lemon-icon" onClick={handleAdminClick} style={{ position: "absolute", right: "1.25rem", top: "1.25rem", color:"white", zIndex: 2 }}/>
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

        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem', marginTop: '3rem' }}>
          {/* <svg
            width="400"
            height="110"
            viewBox="0 0 400 110"
            style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%) scale(0.7)', zIndex: 0 }}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M20,70 Q5,30 120,40 Q180,10 260,35 Q380,5 360,55 Q390,110 270,100 Q210,115 140,100 Q10,110 20,70 Z"
              fill="#d1c4e9"
              stroke="#b39ddb"
              strokeWidth="2"
            />
          </svg> */}
          <span
            style={{
              ...COOL_FONTS['uncial-antiqua-regular'],
              fontSize: '3.2rem',
              color: COLORS.headerText,
              fontWeight: 400,
              letterSpacing: 2,
              padding: '0.5rem 2.5rem',
              display: 'inline-block',
              minWidth: 220,
              maxWidth: '100%',
              wordBreak: 'break-word',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              background: 'none',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            Ohara Library
          </span>
        </div>
        
        {/* Responsive controls */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginTop: '2rem',
            marginBottom: '1.5rem',
          }}
        >
          <Input
            icon={<Icon name='search'/>}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, author, or year..."
            style={{ minWidth: 180, maxWidth: 320, flex: '1 1 180px' }}
          />
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
              style={{ marginLeft: 8, minWidth: 120, maxWidth: 180 }}
            />
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
        <style>{`
          @media (max-width: 600px) {
            .hide-on-mobile {
              display: none !important;
            }
          }
        `}</style>
          
        {/* Total book count statistic */}
        <div style={{ textAlign: 'center', margin: '1rem 0', fontSize: '1.3rem', fontWeight: 600, color: COLORS.headerText }}>
          Total Books: {books.length}
        </div>
        {/* Book images grid */}
        <div style={{ width: '100%', margin: '1rem 0', display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
          {sortedBooks.length > 0 ? (
            <>
              {sortedBooks.map(book => (
                <Image 
                  key={book.Id}
                  src={book.thumbnail ? book.thumbnail : `https://placehold.co/110x170?text=${encodeURIComponent(book.BookTitle)}`}
                  style={{ width: 100, height: 150, borderRadius: 4 }} 
                />
              ))}
            </>
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
      </div>
    </>
  );
}

export default HomePage;
