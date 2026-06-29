import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { COLORS, DARK_COLORS } from '../constants';


export default function AdminDashboardPane({ books }) {
  const adminTheme = DARK_COLORS.admin;
  const [categoryCounts, setCategoryCounts] = useState({});
  const [shelfLocationCounts, setShelfLocationCounts] = useState({});

  useEffect(() => {
    const catCounts = {};
    const shelfCounts = {};

    books.forEach(book => {
      if (typeof book.Category === 'string' && book.Category.trim()) {
        catCounts[book.Category] = (catCounts[book.Category] || 0) + 1;
      }
      if (typeof book.ShelfLocation === 'string' && book.ShelfLocation.trim()) {
        shelfCounts[book.ShelfLocation] = (shelfCounts[book.ShelfLocation] || 0) + 1;
      }
    });

    setCategoryCounts(catCounts);
    setShelfLocationCounts(shelfCounts);
  }, [books]);

  const categoryEntries = Object.entries(categoryCounts).slice(0, 4);
  const shelfEntries = Object.entries(shelfLocationCounts).slice(0, 4);
  const readCount = books.filter(book => book.Read === true || book.Read === 1 || book.Read === '1').length;
  const readPercentage = books.length ? Math.round((readCount / books.length) * 100) : 0;

  return (
    <div style={{ display: 'grid', gap: '20px', marginTop: '4px' }}>
      <section style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: adminTheme.textDim }}>Overview</div>
            <h2 style={{ margin: '4px 0 0', fontSize: '24px', color: adminTheme.text }}>Dashboard</h2>
          </div>
          <Link to="/admin-panel/add-book" style={primaryButtonStyle}>＋ Add book</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <MetricCard label="Total books" value={books.length} icon="📚" adminTheme={adminTheme} />
          <MetricCard label="Categories" value={categoryEntries.length} icon="🗂️" adminTheme={adminTheme} />
          <MetricCard label="Shelf zones" value={shelfEntries.length} icon="🧺" adminTheme={adminTheme} />
          <MetricCard label="Books read" value={`${readPercentage}%`} icon="✓" adminTheme={adminTheme} />
        </div>
      </section>

      <section style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1.2fr 0.8fr' }}>
        <div style={panelStyle}>
          <h3 style={{ margin: '0 0 12px', color: adminTheme.text }}>By category</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {categoryEntries.length === 0 ? (
              <div style={{ color: adminTheme.textSoft }}>No categories recorded yet.</div>
            ) : (
              categoryEntries.map(([name, count]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: adminTheme.cardBackground, borderRadius: '10px' }}>
                  <span style={{ color: adminTheme.text, fontWeight: 600 }}>{name}</span>
                  <span style={{ color: adminTheme.textMuted }}>{count} books</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={panelStyle}>
          <h3 style={{ margin: '0 0 12px', color: adminTheme.text }}>Quick flow</h3>
          <ul style={{ margin: 0, paddingLeft: '18px', color: adminTheme.textMuted, lineHeight: 1.7 }}>
            <li>Start with the ISBN and batch metadata.</li>
            <li>If the lookup misses, the form expands for manual entry.</li>
            <li>Keep your shelves organized by category and location.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, icon, adminTheme }) {
  return (
    <div style={{ background: adminTheme.cardBackground, border: `1px solid ${adminTheme.borderStrong}`, borderRadius: '14px', padding: '16px 14px' }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '24px', fontWeight: 700, color: adminTheme.text }}>{value}</div>
      <div style={{ fontSize: '13px', color: adminTheme.textSoft }}>{label}</div>
    </div>
  );
}

const panelStyle = {
  background: DARK_COLORS.admin.headerBackground,
  border: `1px solid ${DARK_COLORS.admin.border}`,
  borderRadius: '18px',
  padding: '18px 20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
};

const primaryButtonStyle = {
  textDecoration: 'none',
  background: COLORS.accentColor,
  color: '#ffffff',
  padding: '9px 14px',
  borderRadius: '999px',
  fontWeight: 700,
  fontSize: '14px',
};

