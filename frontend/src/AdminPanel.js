
import React, { useEffect, useState } from 'react';
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3e8ff' }}>
      <AdminSidebar activePane={activePane} setActivePane={setActivePane} />
      <div style={{ flex: 1, background: '#f8f6fc', minHeight: '100vh', boxShadow: '0 0 24px #a084ca22', overflow: 'auto' }}>
        {activePane === 'dashboard' && <AdminDashboardPane books={books} />}
        {activePane === 'books' && <BooksAdminPane books={books} setBooks={setBooks} />}
      </div>
    </div>
  );
}

export default AdminPanel;
