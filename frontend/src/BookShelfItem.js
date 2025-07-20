import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Genre-based style presets
const GENRE_STYLES = {
  'Spanish Non-Fiction': {
    background: 'linear-gradient(135deg, #b08d57 70%, #c8a2c8 100%)',
    color: '#fff',
    accent: '#c8a2c8',
    fontFamily: 'Georgia, serif',
    texture: 'repeating-linear-gradient(135deg, #fff2, #fff2 4px, transparent 4px, transparent 8px)',
    icon: '📜',
  },
  'Spanish Fiction': {
    background: 'linear-gradient(135deg, #8d5524 70%, #c68642 100%)',
    color: '#fff',
    accent: '#a67c52',
    fontFamily: 'Trebuchet MS, sans-serif',
    texture: 'repeating-linear-gradient(45deg, #fff1, #fff1 6px, transparent 6px, transparent 12px)',
    icon: '🧭',
  },
  'New TBR': {
    background: 'linear-gradient(135deg, #6b4fbb 70%, #e0c3fc 100%)',
    color: '#fff',
    accent: '#e0c3fc',
    fontFamily: 'Papyrus, fantasy',
    texture: 'repeating-linear-gradient(90deg, #fff2, #fff2 3px, transparent 3px, transparent 6px)',
    icon: '✨',
  },
  'Comics': {
    background: 'linear-gradient(135deg, #2d3a4b 70%, #6dd5ed 100%)',
    color: '#fff',
    accent: '#6dd5ed',
    fontFamily: 'Consolas, monospace',
    texture: 'repeating-linear-gradient(135deg, #fff2, #fff2 2px, transparent 2px, transparent 4px)',
    icon: '🔬',
  },
  'English Non-Fiction': {
    background: 'linear-gradient(135deg, #e75480 70%, #ffd1dc 100%)',
    color: '#fff',
    accent: '#ffd1dc',
    fontFamily: 'Brush Script MT, cursive',
    texture: 'repeating-linear-gradient(135deg, #fff2, #fff2 5px, transparent 5px, transparent 10px)',
    icon: '💖',
  },
  'English General Fiction': {
    background: 'linear-gradient(135deg, #a67c52 70%, #ffd580 100%)',
    color: '#fff',
    accent: '#ffd580',
    fontFamily: 'Georgia, serif',
    texture: '',
    icon: '',
  },
  'English Classics': {
    background: 'linear-gradient(135deg, #b08d57 70%, #c8a2c8 100%)',
    color: '#fff',
    accent: '#c8a2c8',
    fontFamily: 'Georgia, serif',
    texture: 'repeating-linear-gradient(135deg, #fff2, #fff2 4px, transparent 4px, transparent 8px)',
    icon: '📜',
  },
  'English Speculative': {
    background: 'linear-gradient(135deg, #6b4fbb 70%, #e0c3fc 100%)',
    color: '#fff',
    accent: '#e0c3fc',
    fontFamily: 'Papyrus, fantasy',
    texture: 'repeating-linear-gradient(90deg, #fff2, #fff2 3px, transparent 3px, transparent 6px)',
    icon: '✨',
  },
  // Default fallback
  Default: {
    background: 'linear-gradient(135deg, #a67c52 70%, #ffd580 100%)',
    color: '#fff',
    accent: '#ffd580',
    fontFamily: 'Georgia, serif',
    texture: '',
    icon: '',
  },
};


const BookShelfItem = ({
  title,
  coverImage,
  shelfLocation,
  spineColor = '#a67c52',
  fontFamily = 'Georgia, serif',
  height = 160,
  width,
}) => {
  const [hovered, setHovered] = useState(false);

  // Dynamically calculate width and height based on title length
  const minWidth = 20;
  const maxWidth = 64;
  const minHeight = 140;
  const maxHeight = 180;
  const fontSize = 1.05; // rem
  // Estimate width: 8px per character, clamped
  const dynamicWidth = Math.max(minWidth, Math.min(maxWidth, 8 * (title ? title.length : 1)));
  // Estimate height: base + 1.5px per character, clamped
  const dynamicHeight = Math.max(minHeight, Math.min(maxHeight, height + (title ? Math.floor(title.length * 1.5) : 0)));

    console.log('BookShelfItem props:', dynamicWidth)

  // Use shelfLocation to pick a style from GENRE_STYLES, fallback to Default
  const shelfStyle = GENRE_STYLES[shelfLocation] || GENRE_STYLES.Default;

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
          transition: 'width 0.22s cubic-bezier(.4,2,.3,1), transform 0.35s cubic-bezier(.4,2,.3,1), box-shadow 0.25s, background 0.18s',
          transform: hovered
            ? `translateZ(${dynamicWidth}px) rotateY(-18deg) scale(1.08)`
            : 'translateZ(0) rotateY(0deg) scale(1)',
          boxShadow: hovered
            ? '0 12px 32px 0 rgba(124,63,0,0.25), 0 0 0 4px #ffd580'
            : '0 4px 16px 0 rgba(124,63,0,0.15)',
          background: hovered ? '#fff' : (shelfStyle.background || spineColor),
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
            textShadow: hovered
              ? '0 2px 8px #ffd580'
              : '1px 1px 6px #7c3f00',
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
              boxShadow: '0 8px 32px 0 #b08d57',
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
};

export default BookShelfItem;
