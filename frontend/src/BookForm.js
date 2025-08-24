import React from 'react';

export const SHELF_LOCATIONS = [
  'Spanish Non-Fiction',
  'Spanish Fiction',
  'New TBR',
  'Comics',
  'English Non-Fiction',
  'English General Fiction',
  'English Classics',
  'English Speculative',
];

export default function BookForm({ book, onChange, onSubmit, error, success, submitLabel = 'Submit', readOnlyISBN = false }) {
  return (
    <form onSubmit={onSubmit}>
      {/* BookTitle, Author, ISBN, PageCount, Language, Publisher, Edition, SubCategory, Editor as text */}
      {['BookTitle','Author','ISBN','PageCount','Language','Publisher','Edition','SubCategory','Editor'].map(field => (
        <label key={field} style={{ display: 'block', marginBottom: 12 }}>
          {field}:
          <input
            type="text"
            value={book[field] ?? ''}
            onChange={e => field === 'ISBN' && readOnlyISBN ? undefined : onChange(field, e.target.value)}
            readOnly={field === 'ISBN' && readOnlyISBN}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #a084ca', marginTop: 4, background: field === 'ISBN' && readOnlyISBN ? '#e0e0e0' : '#f3e8ff' }}
          />
        </label>
      ))}
      {/* Category as select */}
      <label style={{ display: 'block', marginBottom: 12 }}>
        Category:
        <select
          value={book.Category ?? ''}
          onChange={e => onChange('Category', e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #a084ca', marginTop: 4, background: '#f3e8ff' }}
        >
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
        </select>
      </label>
      {/* Read as select */}
      <label style={{ display: 'block', marginBottom: 12 }}>
        Read:
        <select
          value={book.Read ?? ''}
          onChange={e => onChange('Read', e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #a084ca', marginTop: 4, background: '#f3e8ff' }}
        >
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
      </label>
      {/* ShelfLocation as select */}
      <label style={{ display: 'block', marginBottom: 12 }}>
        Shelf Location:
        <select
          value={book.ShelfLocation ?? ''}
          onChange={e => onChange('ShelfLocation', e.target.value)}
          style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #a084ca', marginTop: 4, background: '#f3e8ff' }}
        >
          {SHELF_LOCATIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </label>
      {/* Dates as date inputs, display in yyyy-mm-dd format, convert longs to readable dates */}
      {['PublishedDate','DateAdded','DateAcquired'].map(field => {
        let value = book[field] ?? '';
        if ((typeof value === 'number' && !isNaN(value)) || (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value))) {
          const timestamp = parseInt(value, 10);
          const d = new Date(timestamp);
          value = d instanceof Date && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : '';
        }
        else if (typeof value === 'string' && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          const d = new Date(value);
          value = d instanceof Date && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : '';
        }
        if (value && typeof value === 'string' && value !== '' && value !== undefined) {
          const d = new Date(value);
          if (isNaN(d.getTime()) && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            value = '';
          }
        }
        return (
          <label key={field} style={{ display: 'block', marginBottom: 12 }}>
            {field}:
            <input
              type="date"
              value={value}
              onChange={e => onChange(field, e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #a084ca', marginTop: 4, background: '#f3e8ff' }}
            />
          </label>
        );
      })}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: 8, background: '#a084ca', color: '#fff', fontWeight: 'bold', border: 'none', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px #a084ca' }}>
        {submitLabel}
      </button>
    </form>
  );
}
