import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import BooksAdminPane from './BooksAdminPane';
import AdminDashboardPane from './AdminDashboardPane';

function AdminPanel() {
  const [activePane, setActivePane] = useState('books');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => {
        const withThumbnails = data.map(book => ({
          ...book,
          thumbnail: book.ImageLink,
        }));
        setBooks(withThumbnails);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []);

    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'rgb(255, 245, 245)'}}>
        <AdminSidebar />
        <div style={{ flex: 1, minHeight: '100vh', background:'rgb(255, 245, 245)' }}>
          <Routes>
            <Route path="dashboard" element={<AdminDashboardPane books={books} />} />
            <Route path="books" element={<BooksAdminPane books={books} setBooks={setBooks} />} />
            <Route path="/" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </div>
  );
}

export default AdminPanel;
