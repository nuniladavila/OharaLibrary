import React from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
function DateInput({ label, value, onChange }) {
  let dateValue = value ?? '';
  if ((typeof dateValue === 'number' && !isNaN(dateValue)) || (typeof dateValue === 'string' && /^\d+(\.\d+)?$/.test(dateValue))) {
    const timestamp = parseInt(dateValue, 10);
    const d = new Date(timestamp);
    dateValue = d instanceof Date && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : '';
  }
  else if (typeof dateValue === 'string' && dateValue && !/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const d = new Date(dateValue);
    dateValue = d instanceof Date && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : '';
  }
  if (dateValue && typeof dateValue === 'string' && dateValue !== '' && dateValue !== undefined) {
    const d = new Date(dateValue);
    if (isNaN(d.getTime()) && !/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      dateValue = '';
    }
  }
  return (
    <Form.Input
      label={label}
      type="date"
      value={dateValue}
      onChange={onChange}
    />
  );
}

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

export default function BookForm({ book, onChange, onSubmit, error, success, submitLabel = 'Submit', readOnlyISBN = true, onCancel, addModeType }) {
  const isBatch = addModeType === 'Batch';
  // Only show ISBN field for batch mode until backend responds to show manual fields
  const showAllFields = !isBatch || (isBatch && book && book.showManualFields);
  return (
    <Form onSubmit={onSubmit} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #a084ca22', padding: '2rem' }}>
      <Form.Group widths="equal">
        <Form.Input
          label="ISBN"
          required
          value={book && book.ISBN != null ? book.ISBN : ''}
          onChange={e => onChange('ISBN', e.target.value)}
          readOnly={readOnlyISBN}
          disabled={readOnlyISBN}
        />
        <Form.Select
            label="Shelf Location"
            required
            value={book && book.ShelfLocation != null ? book.ShelfLocation : ''}
            onChange={(e, { value }) => onChange('ShelfLocation', value)}
            options={SHELF_LOCATIONS.map(loc => ({ key: loc, value: loc, text: loc }))}
        />
        <Form.Select
            label="Category"
            required
            value={book && book.Category != null ? book.Category : ''}
            onChange={(e, { value }) => onChange('Category', value)}
            options={[{ key: 'fiction', value: 'Fiction', text: 'Fiction' }, { key: 'nonfiction', value: 'Non-Fiction', text: 'Non-Fiction' }]}
        />
        <Form.Select
            label="Language"
            required
            value={book && book.Language != null ? book.Language : ''}
            onChange={(e, { value }) => onChange('Language', value)}
            options={[{ key: 'english', value: 'English', text: 'English' },
                    { key: 'spanish', value: 'Spanish', text: 'Spanish' },
                    { key: 'other', value: 'Other', text: 'Other' }
            ]}
        />        
      </Form.Group>
      {showAllFields && (
        <>
          <Form.Group widths="equal">
            <Form.Input
              label="BookTitle"
              value={book && book.BookTitle != null ? book.BookTitle : ''}
              onChange={e => onChange('BookTitle', e.target.value)}
            />
            <Form.Input
              label="Author"
              value={book && book.Author != null ? book.Author : ''}
              onChange={e => onChange('Author', e.target.value)}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="SubCategory"
              value={book && book.SubCategory != null ? book.SubCategory : ''}
              onChange={e => onChange('SubCategory', e.target.value)}
            />
            <Form.Input
              label="Publisher"
              value={book && book.Publisher != null ? book.Publisher : ''}
              onChange={e => onChange('Publisher', e.target.value)}
            />
            <Form.Input
              label="PublishedDate"
              type="date"
              value={book && book.PublishedDate != null ? book.PublishedDate : ''}
              onChange={e => onChange('PublishedDate', e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label="PageCount"
              type="number"
              width={2}
              value={book && book.PageCount != null ? book.PageCount : ''}
              onChange={e => onChange('PageCount', e.target.value)}
            />
            <Form.Select
              label="Read"
              width={4}
              value={book && book.Read != null ? book.Read : ''}
              onChange={(e, { value }) => onChange('Read', value)}
              options={[{ key: 'yes', value: '1', text: 'Yes' }, { key: 'no', value: '0', text: 'No' }]}
            />
            <Form.Input
              label="DateAcquired"
              type="date"
              width={10}
              value={book && book.DateAcquired != null ? book.DateAcquired : ''}
              onChange={e => onChange('DateAcquired', e.target.value)}
            />
          </Form.Group>
        </>
      )}
      {error && <Message negative content={error} style={{ marginBottom: 16 }} />}
      {success && <Message positive content={success} style={{ marginBottom: 16 }} />}
      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <Button type="submit" size="large" style={{ fontWeight: 'bold', fontSize: '1.1rem', flex: 1, background:'#E64A19', color:'white' }}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" color="grey" size="large" style={{ fontWeight: 'bold', fontSize: '1.1rem', flex: 1 }} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </Form>
  );
}

