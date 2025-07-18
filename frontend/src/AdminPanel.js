import React, { useState } from 'react';
import AddBook from './AddBook';

function DeleteBook() {
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!id.trim()) {
      setError('Please enter a book ID to delete.');
      return;
    }
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete book');
        return;
      }
      setSuccess('Book deleted successfully!');
      setId('');
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px coral', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', color: 'coral', marginBottom: '1rem' }}>Delete a Book</h2>
      <form onSubmit={handleDelete}>
        <label style={{ display: 'block', marginBottom: 12 }}>
          Book ID:
          <input
            type="text"
            value={id}
            onChange={e => setId(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid coral', marginTop: 4 }}
          />
        </label>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
        <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: 8, background: 'coral', color: '#fff', fontWeight: 'bold', border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}>
          Delete Book
        </button>
      </form>
    </div>
  );
}

function AdminPanel() {
  return (
    <div>
      <AddBook />
      <DeleteBook />
    </div>
  );
}

export default AdminPanel;
