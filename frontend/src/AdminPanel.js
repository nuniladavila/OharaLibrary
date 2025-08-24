
import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import BooksAdminPane from './BooksAdminPane';

function AdminPanel() {
  const [activePane, setActivePane] = useState('books');
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3e8ff' }}>
      <AdminSidebar activePane={activePane} setActivePane={setActivePane} />
      <div style={{ flex: 1, background: '#f8f6fc', minHeight: '100vh', boxShadow: '0 0 24px #a084ca22', overflow: 'auto' }}>
        {activePane === 'books' && <BooksAdminPane />}
        {/* Future: Add dashboard/settings panes here */}
      </div>
    </div>
  );
}

export default AdminPanel;
