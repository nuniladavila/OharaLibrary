import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, NavLink, Link } from 'react-router-dom';
import AdminDashboardPane from './AdminDashboardPane';
import AddBook from './AddBook';
import { DARK_COLORS } from '../constants';

function AdminPanel() {
  const [books, setBooks] = useState([]);
  const adminTheme = DARK_COLORS.admin;

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        const withThumbnails = Array.isArray(data)
          ? data.map(book => ({ ...book, thumbnail: book.ImageLink }))
          : [];
        setBooks(withThumbnails);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: adminTheme.pageBackground, color: DARK_COLORS.text, fontFamily: 'Inter, "Segoe UI", sans-serif' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: 240, background: adminTheme.sidebarBackground, borderRight: `1px solid ${adminTheme.border}`, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/admin-panel/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 6px', marginBottom: '20px', textDecoration: 'none', color: adminTheme.text }}>
            <img src={require('../../assets/librarynicolilac.png')} alt="Ohara Library Logo" style={{ width: 44, height: 44, borderRadius: '50%' }} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>Ohara Library</div>
              <div style={{ fontSize: '12px', color: adminTheme.textSubtle }}>Admin workspace</div>
            </div>
          </Link>

          <NavLink to="/admin-panel/dashboard" style={({ isActive }) => sidebarLinkStyle(isActive, adminTheme)}>
            <span style={{ fontSize: '16px' }}>◫</span>
            Dashboard
          </NavLink>
          <NavLink to="/admin-panel/add-book" style={({ isActive }) => sidebarLinkStyle(isActive, adminTheme)}>
            <span style={{ fontSize: '16px' }}>＋</span>
            Add books
          </NavLink>
        </aside>

        <main style={{ flex: 1, padding: '24px 28px', background: adminTheme.pageBackground }}>
          <div style={{ background: adminTheme.headerBackground, border: `1px solid ${adminTheme.border}`, borderRadius: '18px', padding: '18px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: adminTheme.textSoft }}>Library admin</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: adminTheme.text }}>A calm place to manage your shelf</div>
            </div>
            <div style={{ padding: '7px 12px', background: adminTheme.cardBackground, borderRadius: '999px', color: adminTheme.textMuted, fontSize: '13px', fontWeight: 600 }}>Notion-inspired</div>
          </div>

          <Routes>
            <Route path="dashboard" element={<AdminDashboardPane books={books} />} />
            <Route path="add-book" element={<AddBook />} />
            <Route path="/" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function sidebarLinkStyle(isActive, adminTheme) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '10px',
    textDecoration: 'none',
    color: isActive ? adminTheme.text : adminTheme.textSubtle,
    background: isActive ? adminTheme.cardBackground : 'transparent',
    fontWeight: isActive ? 700 : 600,
  };
}

export default AdminPanel;
