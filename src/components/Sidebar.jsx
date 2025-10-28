import React, { useState } from 'react';

function Sidebar() {
  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMenus, setExpandedMenus] = useState({
    engagement: false,
    messaging: false,
    phone: false,
    advanced: false,
    admin: false
  });

  const venues = [
    { name: 'Sakura Tokyo', location: 'Tokyo, Japan', status: 'Current' },
    { name: 'Blue Ocean', location: 'Sydney, Australia', status: 'Active' },
    { name: 'Mountain View', location: 'Denver, USA', status: 'Active' },
  ];

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top-container">
        {/* Venue Selector */}
        <div className="venue-selector-container">
          <button
            className="venue-selector-button"
            onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
            aria-expanded={venueDropdownOpen}
          >
            <div className="venue-info">
              <div className="venue-logo">S</div>
              <div className="venue-details">
                <div className="venue-name">Sakura Tokyo</div>
              </div>
            </div>
            <svg className="venue-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {venueDropdownOpen && (
            <div className="venue-dropdown">
              <div className="venue-dropdown-content">
                <div className="venue-list">
                  {venues.map((venue, index) => (
                    <div
                      key={index}
                      className={`venue-option ${index === 0 ? 'active' : ''}`}
                      onClick={() => setVenueDropdownOpen(false)}
                    >
                      <div className="venue-option-info">
                        <div className="venue-option-name">{venue.name}</div>
                        <div className="venue-option-location">{venue.location}</div>
                      </div>
                      {venue.status === 'Current' && (
                        <div className="venue-option-status">{venue.status}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="venue-settings">
                  <button className="venue-settings-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                    </svg>
                    Venue Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search (⌘+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Home */}
        <a href="#" className="nav-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9,22 9,12 15,12 15,22"></polyline>
          </svg>
          Home
        </a>

        {/* Current Venue Section */}
        <div className="nav-section-header">Current Venue</div>
        
        <a href="#" className="nav-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          Venue Settings
        </a>
        
        <a href="#" className="nav-item active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          Menu
        </a>
        
        <a href="#" className="nav-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Hours & Meal Periods
        </a>
        
        <a href="#" className="nav-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Tables
        </a>

        {/* Global Section */}
        <div className="nav-section-header">Global</div>
        
        <a href="#" className="nav-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="13.5" cy="6.5" r=".5"></circle>
            <circle cx="17.5" cy="10.5" r=".5"></circle>
            <circle cx="8.5" cy="7.5" r=".5"></circle>
            <circle cx="6.5" cy="12.5" r=".5"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
          Themes
        </a>
        
        <a href="#" className="nav-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Users
        </a>
        
        {/* Engagement - Expandable */}
        <div className="nav-item nav-item-expandable" onClick={() => toggleMenu('engagement')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Engagement
          <svg 
            className={`nav-chevron ${expandedMenus.engagement ? 'expanded' : ''}`} 
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        {expandedMenus.engagement && (
          <div className="nav-submenu">
            <a href="#" className="nav-item nav-subitem">Email Campaigns</a>
            <a href="#" className="nav-item nav-subitem">Social Media</a>
            <a href="#" className="nav-item nav-subitem">Reviews</a>
          </div>
        )}
        
        {/* Messaging - Expandable */}
        <div className="nav-item nav-item-expandable" onClick={() => toggleMenu('messaging')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
          Messaging
          <svg 
            className={`nav-chevron ${expandedMenus.messaging ? 'expanded' : ''}`} 
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        {expandedMenus.messaging && (
          <div className="nav-submenu">
            <a href="#" className="nav-item nav-subitem">SMS Notifications</a>
            <a href="#" className="nav-item nav-subitem">Email Notifications</a>
            <a href="#" className="nav-item nav-subitem">WhatsApp</a>
          </div>
        )}
        
        {/* Phone - Expandable */}
        <div className="nav-item nav-item-expandable" onClick={() => toggleMenu('phone')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Phone
          <svg 
            className={`nav-chevron ${expandedMenus.phone ? 'expanded' : ''}`} 
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        {expandedMenus.phone && (
          <div className="nav-submenu">
            <a href="#" className="nav-item nav-subitem">Voice Calls</a>
            <a href="#" className="nav-item nav-subitem">Call Settings</a>
            <a href="#" className="nav-item nav-subitem">Call Logs</a>
          </div>
        )}
        
        {/* Advanced - Expandable */}
        <div className="nav-item nav-item-expandable" onClick={() => toggleMenu('advanced')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          Advanced
          <svg 
            className={`nav-chevron ${expandedMenus.advanced ? 'expanded' : ''}`} 
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        {expandedMenus.advanced && (
          <div className="nav-submenu">
            <a href="#" className="nav-item nav-subitem">API Settings</a>
            <a href="#" className="nav-item nav-subitem">Integrations</a>
            <a href="#" className="nav-item nav-subitem">Custom Fields</a>
          </div>
        )}
        
        {/* Admin - Expandable with TC badge */}
        <div className="nav-item nav-item-expandable" onClick={() => toggleMenu('admin')}>
          <span className="nav-badge">TC</span>
          Admin
          <svg 
            className={`nav-chevron ${expandedMenus.admin ? 'expanded' : ''}`} 
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        {expandedMenus.admin && (
          <div className="nav-submenu">
            <a href="#" className="nav-item nav-subitem">System Settings</a>
            <a href="#" className="nav-item nav-subitem">User Management</a>
            <a href="#" className="nav-item nav-subitem">Audit Logs</a>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="help-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Help
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

