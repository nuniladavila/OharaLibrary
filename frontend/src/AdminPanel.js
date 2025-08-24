
import React from 'react';
import AddBook from './AddBook';
import UpdateBook from './UpdateBook';
import DeleteBook from './DeleteBook';

function AdminPanel() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      maxWidth: 1200,
      margin: '2rem auto',
      alignItems: 'start',
    }}>
      <div>
        <AddBook />
                <DeleteBook />

      </div>
      <div>
                <UpdateBook />

      </div>
    </div>
  );
}

export default AdminPanel;
