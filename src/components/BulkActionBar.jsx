import React from 'react';
import './BulkActionBar.css';

function BulkActionBar({ selectedCount, onBulkEdit, onBulkDelete, onClearSelection }) {
  if (selectedCount === 0) return null;

  return (
    <div className="bulk-action-bar">
      <div className="bulk-action-content">
        <span className="bulk-action-text">
          {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
        </span>
        <div className="bulk-action-buttons">
          <button className="button secondary" onClick={onBulkEdit}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>
          <button className="button secondary" onClick={onBulkDelete}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
          <button className="button tertiary" onClick={onClearSelection}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default BulkActionBar;

