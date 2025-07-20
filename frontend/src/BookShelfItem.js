import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GENRE_STYLES, BOOK_SHELF_CONSTANTS } from './constants'; // Import genre styles


// Hash a string to a vibrant random color
function hashStringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generate HSL color (full spectrum, vibrant)
  const h = Math.abs(hash) % 360;
  const s = 70 + (Math.abs(hash) % 30); // 70-100% saturation
  const l = 35 + (Math.abs(hash) % 40); // 35-75% lightness
  return `hsl(${h},${s}%,${l}%)`;
}

const BookShelfItem = ({
  title,
  coverImage,
  shelfLocation,
  pageCount = 0,
  spineColor = '#a67c52',
  fontFamily = 'Georgia, serif'
}) => {
  const [hovered, setHovered] = useState(false);

  // Use hash of title for color
  const hashedColor = title ? hashStringToColor(title) : null;

// If pageCount is provided and > 0, use it for width; else use title length
  let dynamicWidth;
  if (pageCount && pageCount > 0) {
    // 1px per 10 pages, clamped
    dynamicWidth = Math.max(BOOK_SHELF_CONSTANTS.minBookWidth, Math.min(BOOK_SHELF_CONSTANTS.maxBookWidth, Math.round(pageCount / 10)));
  } else {
    dynamicWidth = Math.max(BOOK_SHELF_CONSTANTS.minBookWidth, Math.min(BOOK_SHELF_CONSTANTS.maxBookWidth, 8 * (title ? title.length : 1)));
  }

  // Dynamically scale font size so title fits within the spine width
  let fontSize = 1.05; // rem default
  if (title && dynamicWidth) {
    const maxChars = 14;
    if (title.length > maxChars) {
      fontSize = 0.85;
    //   fontSize = Math.max(BOOK_SHELF_CONSTANTS.minFontSize, (dynamicWidth / (title.length/charsPerLine * 0.7)));
    }
  }

  // Estimate height: base + 1.5px per character, clamped
  const dynamicHeight = Math.max(BOOK_SHELF_CONSTANTS.minBookHeight, Math.min(BOOK_SHELF_CONSTANTS.maxBookHeight, 160 + (title ? Math.floor(title.length * 1.5) : 0)));

  // Use shelfLocation to pick a style from GENRE_STYLES, fallback to Default
  const shelfStyle = GENRE_STYLES[shelfLocation] || GENRE_STYLES.Default;
  const bookSpineColor = hashedColor || (shelfStyle.background || spineColor);

  return (
    <div
      className="bookshelf-item"
      style={{
        perspective: 800,
        display: 'inline-block',
        margin: '0 2.5px', // 5px total between books
        height: dynamicHeight,
        width: dynamicWidth,
        verticalAlign: 'bottom',
        position: 'relative',
        zIndex: hovered ? 10 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={0}
      aria-label={`View details for ${title}`}
    >
      <div
        className="spine-or-cover"
        style={{
          height: dynamicHeight,
          width: hovered ? 6 : dynamicWidth,
          minWidth: 6,
          maxWidth: dynamicWidth,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'width 0.22s cubic-bezier(.4,2,.3,1), transform 0.35s cubic-bezier(.4,2,.3,1), background 0.18s',
          transform: hovered
            ? `translateZ(${dynamicWidth}px) rotateY(-18deg) scale(1.08)`
            : 'translateZ(0) rotateY(0deg) scale(1)',
          background: hovered ? '#fff' : bookSpineColor,
          borderRadius: 7,
          cursor: 'pointer',
          zIndex: hovered ? 10 : 1,
          overflow: 'visible',
        }}
      >
        {/* Book spine (vertical title) */}
        <div
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            color: hovered ? '#7c3f00' : '#fff',
            fontWeight: 700,
            fontSize: `${fontSize}rem`,
            letterSpacing: 2,
            width: '100%',
            textAlign: 'right',
            padding: '0.5rem 0',
            userSelect: 'none',
            fontFamily,
            whiteSpace: 'pre-line',
            opacity: hovered ? 0 : 1,
            transition: 'opacity 0.18s',
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            transform: 'rotate(180deg)',
            pointerEvents: 'none',
          }}
        >
          {title}
        </div>
        {/* Book cover image (shown on hover) */}
        {hovered && (
          <img
            src={coverImage}
            alt={title}
            style={{
              position: 'absolute',
              left: '100%',
              top: 0,
              width: dynamicHeight * 0.68,
              height: dynamicHeight,
              borderRadius: 7,
              background: '#fff',
              objectFit: 'cover',
              zIndex: 20,
              transition: 'opacity 0.25s',
            }}
            onError={e => { e.target.src = 'https://via.placeholder.com/110x170?text=No+Cover'; }}
          />
        )}
      </div>
    </div>
  );
};

BookShelfItem.propTypes = {
  title: PropTypes.string.isRequired,
  coverImage: PropTypes.string,
  spineColor: PropTypes.string,
  fontFamily: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  pageCount: PropTypes.number,
};

export default BookShelfItem;
