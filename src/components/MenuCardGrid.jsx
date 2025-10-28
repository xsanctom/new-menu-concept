import React from 'react';
import { useMenu } from '../context/MenuContext';

function MenuCardGrid() {
  const { state } = useMenu();

  // Apply filters helper
  const applyFilters = (items) => {
    return items.filter(item => {
      // Search filter
      if (state.searchQuery && !item.name?.toLowerCase().includes(state.searchQuery.toLowerCase())) {
        return false;
      }

      // Status filter
      if (state.filters.status.length > 0 && !state.filters.status.includes(item.status)) {
        return false;
      }

      // Category filter
      if (state.filters.category.length > 0 && !state.filters.category.includes(item.category)) {
        return false;
      }

      // Meals filter
      if (state.filters.meals.length > 0) {
        const itemMeals = Array.isArray(item.meals) ? item.meals : [item.meals];
        const hasMatch = state.filters.meals.some(meal => itemMeals.includes(meal));
        if (!hasMatch) return false;
      }

      // Days filter
      if (state.filters.days.length > 0) {
        const itemDays = Array.isArray(item.days) ? item.days : [item.days];
        const hasMatch = state.filters.days.some(day => itemDays.includes(day));
        if (!hasMatch) return false;
      }

      return true;
    });
  };

  // Group items by category
  const groupedItems = state.menuItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Filter items based on search and filters
  const filteredGroupedItems = Object.keys(groupedItems).reduce((acc, category) => {
    const filtered = applyFilters(groupedItems[category]);
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  return (
    <div className="cards-container" style={{ marginTop: '16px' }}>
      {Object.keys(filteredGroupedItems).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-subtle)' }}>
          No menu items found. Click "New" to add items.
        </div>
      ) : (
        <div className="menu-cards-grid">
          {Object.keys(filteredGroupedItems).map((category) => (
            <div key={category} className="category-section">
              {/* Category Header */}
              <div className="category-header-card">
                <div className="category-info">
                  <h2 className="category-title">{category}</h2>
                  <span className="category-count">{filteredGroupedItems[category].length}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="menu-cards">
                {filteredGroupedItems[category].map((item) => (
                  <div key={item.id} className="menu-card">
                    <div className="card-image">
                      {item.status && (
                        <span className={`status-tag status-${item.status.toLowerCase()}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      )}
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--surface-low)' }}></div>
                      )}
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{item.name}</h3>
                      <p className="card-description">{item.description || 'No description'}</p>
                      
                      {/* Meals and Days Badges */}
                      {(item.meals || item.days) && (
                        <div className="chip-container" style={{ marginTop: '8px' }}>
                          {/* Meals */}
              {item.meals && (
                <div className="chip-row">
                  {(() => {
                    const meals = Array.isArray(item.meals) ? item.meals : [item.meals];
                    const allMeals = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Brunch'];
                    const hasAllMeals = allMeals.every(meal => meals.includes(meal));
                    
                    if (hasAllMeals) {
                      return <span className="chip-meal">All Meals</span>;
                    }
                    
                    const mealAbbrev = (meal) => {
                      return meal; // Display full meal names
                    };
                    return meals.filter(Boolean).map((meal, idx) => (
                      <span key={idx} className="chip-meal">{mealAbbrev(meal)}</span>
                    ));
                  })()}
                </div>
              )}
                          
                          {/* Days */}
              {item.days && (
                <div className="chip-row">
                  {(() => {
                    const days = Array.isArray(item.days) ? item.days : [item.days];
                    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    const hasAllDays = allDays.every(day => days.includes(day));
                    
                    if (hasAllDays) {
                      return <span className="chip-day">All Days</span>;
                    }
                    
                    const dayAbbrev = (day) => {
                      const abbrevs = { 'Sunday': 'Su', 'Monday': 'M', 'Tuesday': 'Tu', 'Wednesday': 'W', 'Thursday': 'Th', 'Friday': 'F', 'Saturday': 'Sa' };
                      return abbrevs[day] || day.slice(0, 2);
                    };
                    return days.filter(Boolean).map((day, idx) => (
                      <span key={idx} className="chip-day">{dayAbbrev(day)}</span>
                    ));
                  })()}
                </div>
              )}
                        </div>
                      )}
                      
                      <div className="preview-price-row">
                        <span className="preview-price">${item.price || '0'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuCardGrid;

