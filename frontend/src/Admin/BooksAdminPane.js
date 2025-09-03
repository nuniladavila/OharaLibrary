import React, { useState, useEffect } from 'react';
const EMPTY_BOOK = {
  BookTitle: '',
  Author: '',
  ISBN: '',
  ShelfLocation: '',
  Category: '',
  SubCategory: '',
  Language: '',
  Publisher: '',
  PublishedDate: '',
  PageCount: '',
  Read: '',
  DateAcquired: ''
};
import BookForm from './BookForm';
import BookSearchList from './BookSearchList';
import { Icon, Button, ButtonGroup, Pagination } from 'semantic-ui-react';


export default function BooksAdminPane({ books, setBooks }) {
  // Reset pagination when search changes
  useEffect(() => {
    setActivePage(1);
  }, [search]);
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [addModeType, setAddModeType] = useState(null); // 'Batch' or 'Manual'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formBook, setFormBook] = useState(EMPTY_BOOK);

  const filteredBooks = books.filter(book => {
    const keyword = search.toLowerCase();
    return (
      (book.BookTitle && book.BookTitle.toLowerCase().includes(keyword)) ||
      (book.Author && book.Author.toLowerCase().includes(keyword)) ||
      (book.ISBN && String(book.ISBN).includes(keyword))
    );
  });

  // Pagination state
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormBook(book ? { ...book } : EMPTY_BOOK);
    setEditMode(true);
    setAddMode(false);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (book) => {
    setError('');
    setSuccess('');
    const password = localStorage.getItem('ohara_admin_pwd') || '';
    try {
      const res = await fetch(`/api/books/${book.Id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete book');
        return;
      }
      setSuccess('Book deleted successfully!');
      setBooks(books.filter(b => b.Id !== book.Id));
      setSelectedBook(null);
      setEditMode(false);
    } catch (err) {
      setError('Network error');
    }
  };

  const handleAdd = () => {
    setAddMode(true);
    setEditMode(false);
    setAddModeType(null);
    setBatchSearchDone(false);
    setSelectedBook(null);
    setFormBook({ ...EMPTY_BOOK });
    setError('');
    setSuccess('');
  };
  // Handles input changes in BookForm
  const handleFormChange = (field, value) => {
    setFormBook(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (bookData) => {
    setError('');
    setSuccess('');
    const password = localStorage.getItem('ohara_admin_pwd') || '';
    const method = addMode ? 'POST' : 'PUT';
  const url = addMode ? '/api/books' : `/api/books/${bookData.ISBN}`;

    console.log(method, url)
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
          'x-input-mode': addModeType || 'Manual'
        },
        body: JSON.stringify({ bookData }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If batch mode and book not found, show all fields for manual entry
        if (addMode && addModeType === 'Batch') {
          setFormBook(prev => ({ ...prev, ...data.bookData }));
          setAddModeType("Manual");
        }
        else setError(data.error || 'Failed to save book');
        return;
      }
      setSuccess(addMode ? 'Book added successfully!' : 'Book updated successfully!');
      setAddMode(false);
      setEditMode(false);
      setAddModeType(null);
      setSelectedBook(null);
      // Refresh books
      fetch('/api/books')
        .then(res => res.json())
        .then(data => setBooks(data));
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, author, or ISBN..."
          style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid #FF7043', background: 'white', marginRight: 16 }}
        />
        <Button
          style={{ fontWeight: 'bold', fontSize: '1.1rem', background: '#E64A19', color: '#fff' }}
          icon='plus'
          content='Add Book'
          onClick={handleAdd}
        />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      {!editMode && !addMode && (
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #FF704322', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgb(255, 245, 245)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#FF7043', fontWeight: 600 }}>Item</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#FF7043', fontWeight: 600 }}>Category</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#FF7043', fontWeight: 600 }}>Author</th>
                <th style={{ textAlign: 'center', padding: '0.75rem', color: '#FF7043', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBooks.map(book => (
                <tr key={book.Id || book.ISBN} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Book cover image or placeholder */}
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.BookTitle}
                        style={{ width: 48, height: 64, objectFit: 'cover', borderRadius: 8, marginRight: 8, boxShadow: '0 2px 8px #FF704322' }}
                      />
                    ) : (
                      <div style={{ width: 48, height: 64, background: '#eee', borderRadius: 8, overflow: 'hidden', marginRight: 8 }} />
                    )}
                    <span>{book.BookTitle}</span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {book.Category && Array.isArray(book.SubCategory)
                      ? book.SubCategory.map(cat => (
                          <span key={cat} style={{ background: '#FF7043', color: '#fff', borderRadius: 8, padding: '2px 8px', marginRight: 4, fontSize: 12, fontWeight: 500 }}>{cat}</span>
                        ))
                      : null}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{book.Author}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <ButtonGroup>
                        <Button icon>
                            <Icon name='edit' title='Edit' onClick={() => handleEdit(book)} />
                        </Button>
                        <Button icon>
                            <Icon name='trash alternate' title='Delete' onClick={() => handleDelete(book)}/>
                        </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Pagination
              activePage={activePage}
              totalPages={totalPages}
              onPageChange={(e, { activePage }) => setActivePage(activePage)}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              boundaryRange={1}
              secondary
            />
          </div>
        </div>
      )}
      {(editMode || addMode) && (
  <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #FF704322', padding: '2rem', marginTop: 24 }}>
          {addMode && !addModeType && (
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 'bold', marginRight: 16 }}>Add Mode:</label>
              <Button color={addModeType === 'Manual' ? 'violet' : undefined} onClick={() => setAddModeType('Manual')}>Manual</Button>
              <Button color={addModeType === 'Batch' ? 'violet' : undefined} onClick={() => setAddModeType('Batch')}>Batch</Button>
            </div>
          )}
          {((addMode && addModeType) || editMode) && (
            <BookForm
              book={formBook}
              onChange={handleFormChange}
              onSubmit={() => handleFormSubmit(formBook)}
              error={error}
              success={success}
              submitLabel={addMode ? 'Add Book' : 'Update Book'}
              readOnlyISBN={editMode}
              onCancel={() => {
                setEditMode(false);
                setAddMode(false);
                setAddModeType(null);
                setSelectedBook(null);
                setFormBook(EMPTY_BOOK);
                setError('');
                setSuccess('');
              }}
              addModeType={addModeType}
            />
          )}
        </div>
      )}
    </div>
  );
}
