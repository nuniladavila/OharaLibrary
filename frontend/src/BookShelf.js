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
    //   const margin = 5;
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

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
      {shelfRows.length > 0 ? (
        shelfRows.map((row, idx) => (
          <div
            key={idx}
            className="shelf-row"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              borderRadius: 12,
              margin: '1rem 0',
              padding: '1rem 0',
              boxShadow: '0 8px 24px ' + COLORS.shelfShadow,
              overflowX: 'hidden',
              position: 'relative',
              transition: 'box-shadow 0.3s',
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
                  spineColor={COLORS.shelf}
                  pageCount={book.PageCount}
                  fontFamily={'Georgia, serif'}
                  shelfLocation={book.ShelfLocation}
                />
              </div>
            ))}
          </div>
        ))
      ) : (
        <div style={{ color: COLORS.header, fontSize: '1.2rem', marginTop: '2rem', fontWeight: 'bold', textShadow: '1px 1px 6px #b08d57' }}>No books found.</div>
      )}
    {/* Side pane for book details */}
    <BookSidePanel book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div> 
  );
};

export default BookShelf;
