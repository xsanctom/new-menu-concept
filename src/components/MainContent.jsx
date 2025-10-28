import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import MenuTableEnhanced from './MenuTableEnhanced';
import MenuCardGrid from './MenuCardGrid';
import ColumnVisibilityDropdown from './ColumnVisibilityDropdown';
import BulkActionBar from './BulkActionBar';
import FilterPanel from './FilterPanel';

const DEFAULT_VISIBLE_COLUMNS = ['image', 'tagline', 'price', 'status', 'meals', 'days'];

function MainContent({ onEditItem }) {
  const { state, setViewMode, setSearch, deleteMenuItem, setSelectedItems } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem('visibleColumns');
    return saved ? JSON.parse(saved) : DEFAULT_VISIBLE_COLUMNS;
  });
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearch(query);
  };

  const handleToggleColumn = (columnId) => {
    const newVisibleColumns = visibleColumns.includes(columnId)
      ? visibleColumns.filter(id => id !== columnId)
      : [...visibleColumns, columnId];
    setVisibleColumns(newVisibleColumns);
    localStorage.setItem('visibleColumns', JSON.stringify(newVisibleColumns));
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${state.selectedItems.length} selected item(s)?`)) {
      state.selectedItems.forEach(id => deleteMenuItem(id));
      setSelectedItems([]);
    }
  };

  const handleBulkEdit = () => {
    // This will be implemented with BulkEditModal
    alert('Bulk edit feature coming soon!');
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const getActiveFilterCount = () => {
    return Object.values(state.filters).reduce((total, arr) => total + arr.length, 0);
  };

  return (
    <div className="main-content" style={{ padding: '24px' }}>
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-left">
          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-button ${state.viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <button
              className={`view-button ${state.viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card view"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
          />

          {/* Filter Button */}
          <div className="filter-button-container" style={{ position: 'relative' }}>
            <button 
              className="filter-button"
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="filter-indicator">{getActiveFilterCount()}</span>
              )}
            </button>

            <FilterPanel 
              isOpen={filterPanelOpen}
              onClose={() => setFilterPanelOpen(false)}
            />
          </div>
        </div>

        <div className="filter-right">
          {/* Column Visibility Toggle */}
          {state.viewMode === 'table' && (
            <ColumnVisibilityDropdown 
              visibleColumns={visibleColumns}
              onToggleColumn={handleToggleColumn}
            />
          )}
          
          {/* Sort Dropdown */}
          <div className="sort-dropdown">
            <button
              className="sort-button"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="7" y1="12" x2="21" y2="12"></line>
                <line x1="11" y1="18" x2="21" y2="18"></line>
              </svg>
              Sort: {sortBy === 'name' ? 'Name' : 'Price'}
            </button>

            {sortDropdownOpen && (
              <div className="sort-options">
                <div
                  className={`sort-option ${sortBy === 'name' ? 'active' : ''}`}
                  onClick={() => {
                    setSortBy('name');
                    setSortDropdownOpen(false);
                  }}
                >
                  Name
                </div>
                <div
                  className={`sort-option ${sortBy === 'price' ? 'active' : ''}`}
                  onClick={() => {
                    setSortBy('price');
                    setSortDropdownOpen(false);
                  }}
                >
                  Price
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {state.viewMode === 'table' ? (
        <MenuTableEnhanced onEditItem={onEditItem} visibleColumns={visibleColumns} />
      ) : (
        <MenuCardGrid onEditItem={onEditItem} />
      )}

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={state.selectedItems.length}
        onBulkEdit={handleBulkEdit}
        onBulkDelete={handleBulkDelete}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}

export default MainContent;

