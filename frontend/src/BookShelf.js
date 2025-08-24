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
      const containerWidth = containerRef.current.offsetWidth - BOOK_SHELF_CONSTANTS.sideBorderWidth * 2 - BOOK_SHELF_CONSTANTS.coverWidth * 0.75;
      let count = Math.floor(containerWidth / BOOK_SHELF_CONSTANTS.coverWidth);

      count = Math.max(1, count); // Always show at least 1 book per shelf
      setBooksPerShelf(count);
    }
    updateBooksPerShelf();
    window.addEventListener('resize', updateBooksPerShelf);
    return () => window.removeEventListener('resize', updateBooksPerShelf);
  }, []);

  const shelfRows = groupBooksByCount(books, booksPerShelf);

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
        borderLeft: `${BOOK_SHELF_CONSTANTS.sideBorderWidth}px solid ${COLORS.bookshelfColorWood}`,
        borderRight: `${BOOK_SHELF_CONSTANTS.sideBorderWidth}px solid ${COLORS.bookshelfColorWood}`,
        borderTop: `${BOOK_SHELF_CONSTANTS.topBottomBorderWidth}px solid ${COLORS.bookshelfColorWood}`,
        borderBottom: `${BOOK_SHELF_CONSTANTS.topBottomBorderWidth}px solid ${COLORS.bookshelfColorWood}`,
        borderRadius: 5,
        boxSizing: 'border-box',
        background: 'url("https://www.transparenttextures.com/patterns/purty-wood.png"), #8a6227ff',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {shelfRows.length > 0 ? (
        shelfRows.map((row, idx) => {
          return (
            <div
              key={idx}
              className="shelf-row"
              style={{
                display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center', // Centralize books in the row
                  paddingTop: '1.5rem',
                  overflowX: 'hidden',
                  overflowY: 'hidden',
                  position: 'relative',
                  minHeight: defaultShelfHeight,
                  border: `4px solid ${COLORS.bookshelfColorWood}`, // brown border for wood effect
                  background: 'rgba(74, 55, 26, 0.45)', // more transparent wood background
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
                >
                  <BookShelfItem
                    title={book.BookTitle}
                    coverImage={book.thumbnail}
                    fontFamily={'Georgia, serif'}
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
