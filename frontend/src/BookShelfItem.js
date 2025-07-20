import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GENRE_STYLES, BOOK_SHELF_CONSTANTS } from './constants'; // Import genre styles

const BookShelfItem = ({
  title,
  coverImage
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="bookshelf-item"
      style={{
        display: 'inline-block',
        margin: '0 6px',
        height: BOOK_SHELF_CONSTANTS.coverHeight,
        width: BOOK_SHELF_CONSTANTS.coverWidth,
        verticalAlign: 'bottom',
        position: 'relative',
        borderRadius: 5,
        background: '#fff',
        overflow: 'hidden',
        boxSizing: 'border-box',
        cursor: 'pointer',
      }}
      tabIndex={0}
      aria-label={`View details for ${title}`}
    >
      <img
        src={coverImage || `https://placehold.co/110x170?text=${encodeURIComponent(title)}`}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 5,
          background: '#fff',
          display: 'block',
        }}
        onError={e => { e.target.src = `https://placehold.co/110x170?text=${encodeURIComponent(title)}`; }}
      />
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
