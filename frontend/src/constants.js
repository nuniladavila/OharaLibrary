export const COLORS = {
  background: 'linear-gradient(90deg, #f3e8ff 0%, #e0c3fc 100%)', // lilac to light purple
  shelf: '#a084ca', // lilac purple
  bookBg: '#f8f0fc', // very light purple
  headerText: 'white', // deep lilac
  //headerText: '#7c3f99', // deep lilac
  nav: '#b39ddb', // soft purple
  navText: '#a084ca',
  tooltipBg: '#e0c3fc', // pastel purple
  tooltipText: '#7c3f99',
  genreBg: '#a084ca',
  genreText: '#fff',
  bookshelfColorWood: '#63471dff', // warm wood color
};

export const BOOK_SHELF_CONSTANTS = {
  coverWidth: 110,
  coverHeight: 170,
  sideBorderWidth: 16,
  topBottomBorderWidth: 28,
};

export const GENRE_STYLES = {
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
