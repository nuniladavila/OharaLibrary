import React, { useRef, useEffect, useState } from 'react';
import BookShelfItem from './BookShelfItem';
import BookSidePanel from './BookSidePanel';
import { BOOK_SHELF_CONSTANTS } from './constants';


function groupBooksByCount(books, count) {
  const shelves = [];
  let i = 0;
  while (i < books.length) {
    shelves.push(books.slice(i, i + count));
    i += count;
  }
  return shelves;
}


const BookShelf = ({ books = [], COLORS}) => {
  const containerRef = useRef(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [booksPerShelf, setBooksPerShelf] = useState(20);

  useEffect(() => {
    function updateBooksPerShelf() {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const totalBookWidth = BOOK_SHELF_CONSTANTS.maxBookWidth * 0.9;
      let count = Math.floor(containerWidth / totalBookWidth);
        console.log("Calculated books per shelf:", count);

      count = Math.max(18, count); // Always show at least 18 books per shelf
      setBooksPerShelf(count);
    }
    updateBooksPerShelf();
    window.addEventListener('resize', updateBooksPerShelf);
    return () => window.removeEventListener('resize', updateBooksPerShelf);
  }, []);

  const shelfRows = groupBooksByCount(books, booksPerShelf);

  // Track which book is hovered in each row
  const [hoveredBookId, setHoveredBookId] = useState(null);

  // Height for expanded shelf (cover image height + some margin)
  const defaultShelfHeight = 170;

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        paddingBottom: 40,
        borderLeft: '16px solid #8B5C2A',
        borderRight: '16px solid #8B5C2A',
        borderTop: '24px solid #8B5C2A',
        borderBottom: '28px solid #8B5C2A',
        borderRadius: 18,
        boxSizing: 'border-box',
        background: 'rgba(74, 55, 26, 0.10)',
      }}
    >
      {shelfRows.length > 0 ? (
        shelfRows.map((row, idx) => {
          // If any book in this row is hovered, expand the shelf
          const isRowHovered = row.some(book => book.Id === hoveredBookId);
          return (
            <div
              key={idx}
              className="shelf-row"
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                paddingTop: '1.5rem',
                overflowX: 'hidden',
                overflowY: 'hidden',
                position: 'relative',
                transition: 'min-height 0.3s cubic-bezier(.4,2,.3,1)',
                minHeight: defaultShelfHeight,
                border: '4px solid #8B5C2A', // brown border for wood effect
                background: 'rgba(74, 55, 26, 0.45)', // more transparent wood background
                // minHeight: isRowHovered ? expandedShelfHeight : defaultShelfHeight,
              }}
            >
              {row.map(book => (
                <div
                  key={book.Id}
                  style={{ position: 'relative', cursor: 'pointer' }}
                  onClick={() => setSelectedBook(book)}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedBook(book); }}
                  aria-label={`View details for ${book.BookTitle}`}
                  role="button"
                  onMouseEnter={() => setHoveredBookId(book.Id)}
                  onMouseLeave={() => setHoveredBookId(null)}
                >
                  <BookShelfItem
                    title={book.BookTitle}
                    coverImage={book.thumbnail}
                    spineColor={COLORS.shelf}
                    pageCount={book.PageCount}
                    fontFamily={'Georgia, serif'}
                    shelfLocation={book.ShelfLocation}
                  />
                </div>
              ))}
            </div>
          );
        })
      ) : (
        <div style={{ color: COLORS.header, fontSize: '1.2rem', marginTop: '2rem', fontWeight: 'bold', textShadow: '1px 1px 6px #e0c3fc' }}>No books found.</div>
      )}
      {/* Side pane for book details */}
      <BookSidePanel book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
};

export default BookShelf;
