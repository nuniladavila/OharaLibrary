import React from 'react';

// Genre-based style presets
const GENRE_STYLES = {
  Historical: {
    background: 'linear-gradient(135deg, #b08d57 70%, #c8a2c8 100%)',
    color: '#fff',
    accent: '#c8a2c8',
    fontFamily: 'Georgia, serif',
    texture: 'repeating-linear-gradient(135deg, #fff2, #fff2 4px, transparent 4px, transparent 8px)',
    icon: '📜',
  },
  Adventure: {
    background: 'linear-gradient(135deg, #8d5524 70%, #c68642 100%)',
    color: '#fff',
    accent: '#a67c52',
    fontFamily: 'Trebuchet MS, sans-serif',
    texture: 'repeating-linear-gradient(45deg, #fff1, #fff1 6px, transparent 6px, transparent 12px)',
    icon: '🧭',
  },
  Fantasy: {
    background: 'linear-gradient(135deg, #6b4fbb 70%, #e0c3fc 100%)',
    color: '#fff',
    accent: '#e0c3fc',
    fontFamily: 'Papyrus, fantasy',
    texture: 'repeating-linear-gradient(90deg, #fff2, #fff2 3px, transparent 3px, transparent 6px)',
    icon: '✨',
  },
  Science: {
    background: 'linear-gradient(135deg, #2d3a4b 70%, #6dd5ed 100%)',
    color: '#fff',
    accent: '#6dd5ed',
    fontFamily: 'Consolas, monospace',
    texture: 'repeating-linear-gradient(135deg, #fff2, #fff2 2px, transparent 2px, transparent 4px)',
    icon: '🔬',
  },
  Romance: {
    background: 'linear-gradient(135deg, #e75480 70%, #ffd1dc 100%)',
    color: '#fff',
    accent: '#ffd1dc',
    fontFamily: 'Brush Script MT, cursive',
    texture: 'repeating-linear-gradient(135deg, #fff2, #fff2 5px, transparent 5px, transparent 10px)',
    icon: '💖',
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

function BookSpine({
  title,
  author,
  genre = 'Default',
  color,
  accent,
  font,
  height = 160,
  width = 48,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isSelected,
  showIcon = true,
  style = {},
}) {
  const genreStyle = GENRE_STYLES[genre] || GENRE_STYLES.Default;
  const spineColor = color || genreStyle.background;
  const accentColor = accent || genreStyle.accent;
  const fontFamily = font || genreStyle.fontFamily;
  const texture = genreStyle.texture;
  const icon = showIcon ? genreStyle.icon : '';

  return (
    <div
      className="book-spine-dynamic"
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={`View details for ${title}`}
      style={{
        height,
        width,
        minWidth: 32,
        maxWidth: 64,
        minHeight: 120,
        maxHeight: 200,
        margin: '0 1.2rem',
        borderRadius: 6,
        boxShadow: isSelected
          ? '0 6px 20px #a94442, 0 0 0 3px ' + accentColor
          : '0 4px 16px #7c3f00',
        background: spineColor,
        backgroundImage: texture,
        border: isSelected ? `2.5px solid ${accentColor}` : '2px solid #fff',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
        zIndex: isSelected ? 2 : 1,
        overflow: 'visible',
        ...style,
      }}
    >
      {/* Optional icon at top */}
      {icon && (
        <span
          style={{
            fontSize: 18,
            position: 'absolute',
            top: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.85,
            pointerEvents: 'none',
          }}
        >
          {icon}
        </span>
      )}
      {/* Vertical title */}
      <div
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          color: genreStyle.color,
          fontWeight: 700,
          fontSize: '1.05rem',
          letterSpacing: 2,
          textShadow: '1px 1px 6px #7c3f00',
          width: '100%',
          textAlign: 'center',
          padding: '0.5rem 0',
          userSelect: 'none',
          fontFamily,
          whiteSpace: 'pre-line',
        }}
      >
        {title}
      </div>
      {/* Author at bottom */}
      {author && (
        <div
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            color: accentColor,
            fontWeight: 400,
            fontSize: '0.85rem',
            fontFamily,
            opacity: 0.8,
            marginBottom: 4,
            marginTop: 2,
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          {author}
        </div>
      )}
    </div>
  );
}

export default BookSpine;
