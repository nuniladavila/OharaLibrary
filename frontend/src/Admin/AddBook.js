import React, { useState } from 'react';
import { DARK_COLORS, COLORS } from '../constants';

const SHELF_LOCATIONS = [
  'Spanish Non-Fiction',
  'Spanish Fiction',
  'New TBR',
  'Comics',
  'English Non-Fiction',
  'English General Fiction',
  'English Classics',
  'English Speculative',
];

const initialBatch = {
  isbn: '',
  category: 'Fiction',
  shelfLocation: SHELF_LOCATIONS[0],
  read: 'true',
};

const initialManualBook = {
  BookTitle: '',
  Author: '',
  ISBN: '',
  Category: 'Fiction',
  ShelfLocation: SHELF_LOCATIONS[0],
  Language: 'English',
  Publisher: '',
  PublishedDate: '',
  PageCount: '',
  Read: true,
  SubCategory: '',
  Edition: '',
  Notes: '',
};

function AddBook() {
  const adminTheme = DARK_COLORS.admin;
  const [mode, setMode] = useState('batch');
  const [batchBook, setBatchBook] = useState(initialBatch);
  const [manualBook, setManualBook] = useState(initialManualBook);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!batchBook.isbn.trim()) {
      setError('Please enter an ISBN.');
      return;
    }

    const password = localStorage.getItem('ohara_admin_pwd') || '';
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
          'x-input-mode': 'Batch',
        },
        body: JSON.stringify({
          bookData: {
            isbn: batchBook.isbn.trim(),
            category: batchBook.category,
            shelfLocation: batchBook.shelfLocation,
            read: batchBook.read === 'true',
          },
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = typeof data?.error === 'string' ? data.error : 'Unable to add the book.';
        const lookedUpMissing = message.toLowerCase().includes('not found');

        if (lookedUpMissing) {
          setManualBook({
            ...initialManualBook,
            ISBN: batchBook.isbn.trim(),
            Category: batchBook.category,
            ShelfLocation: batchBook.shelfLocation,
            Read: batchBook.read === 'true',
          });
          setMode('manual');
          setError('The lookup did not return a result. Please complete the details below.');
        } else {
          setError(message);
        }
        return;
      }

      setSuccess('Book added successfully.');
      setBatchBook(initialBatch);
      setMode('batch');
    } catch (err) {
      setError('Network error while adding the book.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const password = localStorage.getItem('ohara_admin_pwd') || '';
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
          'x-input-mode': 'Manual',
        },
        body: JSON.stringify({
          bookData: {
            ...manualBook,
            ISBN: manualBook.ISBN || batchBook.isbn,
            Category: manualBook.Category || batchBook.category,
            ShelfLocation: manualBook.ShelfLocation || batchBook.shelfLocation,
            Read: Boolean(manualBook.Read),
          },
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'Unable to add the book manually.');
        return;
      }

      setSuccess('Book added successfully.');
      setMode('batch');
      setBatchBook(initialBatch);
      setManualBook(initialManualBook);
    } catch (err) {
      setError('Network error while adding the book.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '20px', marginTop: '4px' }}>
      <section style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: adminTheme.textSoft }}>Add a book</div>
            <h2 style={{ margin: '4px 0 0', fontSize: '24px', color: adminTheme.text }}>Lookup first, then add</h2>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: '999px', background: adminTheme.cardBackground, color: adminTheme.textMuted, fontSize: '13px', fontWeight: 600 }}>
            {mode === 'batch' ? 'Batch mode' : 'Manual fallback'}
          </div>
        </div>

        <p style={{ margin: '0 0 16px', color: adminTheme.textSoft, lineHeight: 1.6 }}>
          Start with the ISBN and the batch properties. If the lookup misses, the form expands so you can finish the entry manually.
        </p>

        {error ? <div style={messageStyle('error')}>{error}</div> : null}
        {success ? <div style={messageStyle('success')}>{success}</div> : null}

        {mode === 'batch' ? (
          <form onSubmit={handleBatchSubmit} style={{ display: 'grid', gap: '14px' }}>
            <label style={labelStyle}>
              <span>ISBN</span>
              <input value={batchBook.isbn} onChange={(e) => setBatchBook({ ...batchBook, isbn: e.target.value })} required placeholder="978..." style={inputStyle} />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <label style={labelStyle}>
                <span>Category</span>
                <select value={batchBook.category} onChange={(e) => setBatchBook({ ...batchBook, category: e.target.value })} style={inputStyle}>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                </select>
              </label>

              <label style={labelStyle}>
                <span>Shelf location</span>
                <select value={batchBook.shelfLocation} onChange={(e) => setBatchBook({ ...batchBook, shelfLocation: e.target.value })} style={inputStyle}>
                  {SHELF_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </label>
            </div>

            <label style={labelStyle}>
              <span>Read?</span>
              <select value={batchBook.read} onChange={(e) => setBatchBook({ ...batchBook, read: e.target.value })} style={inputStyle}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>

            <button type="submit" style={buttonStyle}>
              {isSubmitting ? 'Working…' : 'Lookup and add'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleManualSubmit} style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <label style={labelStyle}>
                <span>Title</span>
                <input value={manualBook.BookTitle} onChange={(e) => setManualBook({ ...manualBook, BookTitle: e.target.value })} style={inputStyle} />
              </label>
              <label style={labelStyle}>
                <span>Author</span>
                <input value={manualBook.Author} onChange={(e) => setManualBook({ ...manualBook, Author: e.target.value })} style={inputStyle} />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <label style={labelStyle}>
                <span>ISBN</span>
                <input value={manualBook.ISBN} onChange={(e) => setManualBook({ ...manualBook, ISBN: e.target.value })} style={inputStyle} />
              </label>
              <label style={labelStyle}>
                <span>Publisher</span>
                <input value={manualBook.Publisher} onChange={(e) => setManualBook({ ...manualBook, Publisher: e.target.value })} style={inputStyle} />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <label style={labelStyle}>
                <span>Category</span>
                <select value={manualBook.Category} onChange={(e) => setManualBook({ ...manualBook, Category: e.target.value })} style={inputStyle}>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                </select>
              </label>
              <label style={labelStyle}>
                <span>Shelf location</span>
                <select value={manualBook.ShelfLocation} onChange={(e) => setManualBook({ ...manualBook, ShelfLocation: e.target.value })} style={inputStyle}>
                  {SHELF_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <label style={labelStyle}>
                <span>Language</span>
                <select value={manualBook.Language} onChange={(e) => setManualBook({ ...manualBook, Language: e.target.value })} style={inputStyle}>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label style={labelStyle}>
                <span>Read?</span>
                <select value={manualBook.Read ? 'true' : 'false'} onChange={(e) => setManualBook({ ...manualBook, Read: e.target.value === 'true' })} style={inputStyle}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>

            <label style={labelStyle}>
              <span>Notes</span>
              <textarea value={manualBook.Notes} onChange={(e) => setManualBook({ ...manualBook, Notes: e.target.value })} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
            </label>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={isSubmitting} style={buttonStyle}>
                {isSubmitting ? 'Saving…' : 'Save manual entry'}
              </button>
              <button type="button" onClick={() => { setMode('batch'); setError(''); setSuccess(''); }} style={secondaryButtonStyle}>
                Back to batch
              </button>
            </div>
          </form>
        )}
      </section>
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

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  color: DARK_COLORS.admin.textMuted,
  fontWeight: 600,
};

const inputStyle = {
  border: `1px solid ${DARK_COLORS.admin.borderStrong}`,
  borderRadius: '10px',
  padding: '10px 12px',
  fontSize: '14px',
  background: DARK_COLORS.admin.inputBackground,
  color: DARK_COLORS.admin.text,
};

const buttonStyle = {
  border: 'none',
  borderRadius: '10px',
  padding: '11px 14px',
  background: COLORS.accentColor,
  color: DARK_COLORS.admin.buttonText,
  fontWeight: 700,
  cursor: 'pointer',
};

const secondaryButtonStyle = {
  border: `1px solid ${DARK_COLORS.admin.borderStrong}`,
  borderRadius: '10px',
  padding: '11px 14px',
  background: DARK_COLORS.admin.secondaryBackground,
  color: DARK_COLORS.admin.secondaryText,
  fontWeight: 700,
  cursor: 'pointer',
};

const messageStyle = (type) => ({
  padding: '10px 12px',
  borderRadius: '10px',
  marginBottom: '12px',
  background: type === 'error' ? DARK_COLORS.admin.errorBackground : DARK_COLORS.admin.successBackground,
  color: type === 'error' ? DARK_COLORS.admin.errorText : DARK_COLORS.admin.successText,
  border: `1px solid ${type === 'error' ? DARK_COLORS.admin.errorBorder : DARK_COLORS.admin.successBorder}`,
});

export default AddBook;
