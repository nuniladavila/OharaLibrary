import React, { useRef, useEffect, useState } from 'react';
import BookShelfItem from './BookShelfItem';



function groupBooksByCount(books, count) {
  const shelves = [];
  let i = 0;
  while (i < books.length) {
    shelves.push(books.slice(i, i + count));
    i += count;
  }
  return shelves;
}


const BookShelf = ({ books = [], COLORS, setSelectedBook }) => {
  const containerRef = useRef(null);
  const [booksPerShelf, setBooksPerShelf] = useState(20);

  useEffect(() => {
    function updateBooksPerShelf() {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      // Estimate average book width (including margin): 64px + 5px = 69px
      // But allow for smaller books, so use 50px as a lower bound
      const avgBookWidth = 54; // 49px book + 5px margin
      const min = 5;
      const max = 40;
      let count = Math.floor(containerWidth / avgBookWidth);
      count = Math.max(min, Math.min(max, count));
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
              margin: '2.5rem 0',
              padding: '1.5rem 0 1.2rem 0',
              boxShadow: '0 8px 24px ' + COLORS.shelfShadow,
              overflowX: 'hidden',
              position: 'relative',
              transition: 'box-shadow 0.3s',
            }}
          >
            {row.map(book => (
              <div key={book.Id} style={{ position: 'relative' }}>
                <BookShelfItem
                  title={book.BookTitle}
                  coverImage={book.thumbnail}
                  spineColor={COLORS.shelf}
                  fontFamily={'Georgia, serif'}
                  height={Math.max(140, Math.min(170, 120 + (book.BookTitle ? book.BookTitle.length * 2 : 0)))}
                  width={Math.max(32, Math.min(64, 12 * (book.BookTitle ? book.BookTitle.length : 1)))}
                  shelfLocation={book.ShelfLocation}
                  onClick={() => setSelectedBook(book)}
                />
              </div>
            ))}
          </div>
        ))
      ) : (
        <div style={{ color: COLORS.header, fontSize: '1.2rem', marginTop: '2rem', fontWeight: 'bold', textShadow: '1px 1px 6px #b08d57' }}>No books found.</div>
      )}
    </div>
  );
};

export default BookShelf;
