import React, { useRef } from 'react';
import { useState } from 'react';

import BookForm from './BookForm';
import { SHELF_LOCATIONS } from './BookForm';

function AddBook() {
  // Manual entry state
  const [manualEntry, setManualEntry] = useState(false);
  const [manualBook, setManualBook] = useState({
    BookTitle: '',
    Author: '',
    PublishedDate: '',
    ISBN: '',
    PageCount: '',
    Category: '',
    ShelfLocation: '',
    Language: '',
    Publisher: '',
    Edition: '',
    Read: '',
    SubCategory: '',
    Editor: '',
  });
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState('Fiction');
  const [read, setRead] = useState('false');
  const [shelfLocation, setShelfLocation] = useState(SHELF_LOCATIONS[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isbnRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check for missing required fields
    const missingFields = [];
    if (!isbn.trim()) missingFields.push('ISBN');
    if (!category) missingFields.push('Category');
    if (!shelfLocation) missingFields.push('Shelf Location');
    if (!read) missingFields.push('Read');

    if (missingFields.length > 0) {
      setError('Missing required field' + (missingFields.length > 1 ? 's: ' : ': ') + missingFields.join(', '));
      if (missingFields.includes('ISBN') && isbnRef.current) {
        isbnRef.current.focus();
      }
      return;
    }

  const password = localStorage.getItem('ohara_admin_pwd') || '';

  const payload = { bookData: { isbn, category, shelfLocation, read } };
console.log("Payload to send:", payload);

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Error while trying to add book: " + (data.error || 'Failed to add book'));
        return;
      }
      if (data === null) {
        setManualEntry(true);
        setManualBook({
          ...manualBook,
          ISBN: isbn,
          Category: category,
          ShelfLocation: shelfLocation,
          Read: read,
        });
        setSuccess('Book not found. Please enter details manually.');
        return;
      }
      setSuccess('Book added successfully!');
      setIsbn('');
      if (isbnRef.current) {
        isbnRef.current.focus();
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '3rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px #a084ca', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', color: '#a084ca', margin: '0 auto 2rem', padding: '0.5rem 0', letterSpacing: 1 }}>Add a Book</h2>
      {!manualEntry ? (
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 12 }}>
            ISBN:
            <input
              type="text"
              value={isbn}
              onChange={e => setIsbn(e.target.value)}
              required
              ref={isbnRef}
              autoFocus
              style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #a084ca', marginTop: 4, background: '#f3e8ff' }}
            />
          </label>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontWeight: 'bold' }}>Category:</span>
            <label style={{ marginLeft: 16 }}>
              <input
                type="radio"
                name="category"
                value="Fiction"
                checked={category === 'Fiction'}
                onChange={() => setCategory('Fiction')}
              /> Fiction
            </label>
            <label style={{ marginLeft: 16 }}>
              <input
                type="radio"
                name="category"
                value="Non-Fiction"
                checked={category === 'Non-Fiction'}
                onChange={() => setCategory('Non-Fiction')}
              /> Non-Fiction
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontWeight: 'bold' }}>Read:</span>
            <label style={{ marginLeft: 16 }}>
              <input
                type="radio"
                name="read"
                value="true"
                checked={read === 'true'}
                onChange={() => setRead('true')}
              /> Yes
            </label>
            <label style={{ marginLeft: 16 }}>
              <input
                type="radio"
                name="read"
                value="false"
                checked={read === 'false'}
                onChange={() => setRead('false')}
              /> No
            </label>
          </div>
          <label style={{ display: 'block', marginBottom: 16 }}>
            Shelf Location:
            <select
              value={shelfLocation}
              onChange={e => setShelfLocation(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #a084ca', marginTop: 4, background: '#f3e8ff' }}
            >
              {SHELF_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </label>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
          <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: 8, background: '#a084ca', color: '#fff', fontWeight: 'bold', border: 'none', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px #a084ca' }}>
            Add Book
          </button>
        </form>
      ) : (
        <BookForm
          book={manualBook}
          onChange={(field, value) => setManualBook({ ...manualBook, [field]: value })}
          onSubmit={async (e) => {
            e.preventDefault();
            setError('');
            setSuccess('');
            const password = localStorage.getItem('ohara_admin_pwd') || '';
            const payload = { bookData: { ...manualBook } };
            try {
              const res = await fetch('/api/books/manual', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-admin-password': password,
                },
                body: JSON.stringify(payload),
              });
              if (!res.ok) {
                const data = await res.json();
                setError("Error while trying to add book: " + (data.error || 'Failed to add book'));
                return;
              }
              setSuccess('Book added successfully!');
              setManualEntry(false);
              setManualBook({
                BookTitle: '', Author: '', PublishedDate: '', ISBN: '', PageCount: '', Category: '', ShelfLocation: '', Language: '', Publisher: '', Edition: '', Read: '', SubCategory: '', Editor: '',
              });
            } catch (err) {
              setError('Network error');
            }
          }}
          error={error}
          success={success}
          submitLabel="Submit Manual Book"
        />
      )}
    </div>
  );
}

export default AddBook;
