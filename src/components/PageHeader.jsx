import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';

function PageHeader({ activeTab, setActiveTab, onOpenAddItemsModal, onOpenMenuItemModal }) {
  const [newMenuOpen, setNewMenuOpen] = useState(false);

  return (
    <div className="page-header">
      <div className="page-header-content">
        <div className="page-title-section">
          <h1 className="page-title">Menus</h1>
          
          {/* Tabs */}
          <div className="page-tabs">
            <button
              className={`tab-button ${activeTab === 'online' ? 'active' : ''}`}
              onClick={() => setActiveTab('online')}
            >
              Online
            </button>
            <button
              className={`tab-button ${activeTab === 'internal' ? 'active' : ''}`}
              onClick={() => setActiveTab('internal')}
            >
              Internal
            </button>
            <button
              className={`tab-button ${activeTab === 'quantity' ? 'active' : ''}`}
              onClick={() => setActiveTab('quantity')}
            >
              Quantity
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="page-actions">
          <button className="page-header-overflow-button" aria-label="More">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="5" cy="12" r="1"></circle>
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
            </svg>
          </button>
          {/* New Menu Dropdown */}
          <div className="new-menu-dropdown">
            <button
              className="button primary"
              onClick={() => setNewMenuOpen(!newMenuOpen)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New
            </button>

            {newMenuOpen && (
              <div className="new-menu-options">
                <button className="dropdown-option" onClick={() => {
                  setNewMenuOpen(false);
                  onOpenMenuItemModal();
                }}>
                  <div className="dropdown-option-content">
                    <div className="dropdown-option-title">Single Menu Item</div>
                    <div className="dropdown-option-description">Create one menu item at a time</div>
                  </div>
                </button>
                
                <div className="dropdown-divider"></div>
                
                <button className="dropdown-option" onClick={() => {
                  setNewMenuOpen(false);
                  onOpenAddItemsModal();
                }}>
                  <div className="dropdown-option-content">
                    <div className="dropdown-option-title">Multiple Menu Items</div>
                    <div className="dropdown-option-description">Easily create up to 60 menu items at once</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;

