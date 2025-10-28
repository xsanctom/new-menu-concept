import React, { useState, useEffect, useRef } from 'react';
import { useMenu } from '../context/MenuContext';
import './EditMenuItemModal.css';

const DAYS = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Tea', 'Dinner', 'Late'];
const CATEGORIES = ['Courses', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Specials'];

function EditMenuItemModal({ isOpen, onClose, itemId = null }) {
  const { state, addMenuItems, updateMenuItem } = useMenu();
  const [activeTab, setActiveTab] = useState('basic');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [showTaxOptions, setShowTaxOptions] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [socialDropdownOpen, setSocialDropdownOpen] = useState(false);
  const socialDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    image: null,
    imagePreview: null,
    tagline: '',
    description: '',
    internalShortName: '',
    finePrint: '',
    howToRedeem: '',
    onlineCategory: 'Courses',
    internalCategory: 'Courses',
    webId: '',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    meals: [],
    price: '',
    originalPrice: '',
    showDiscount: false,
    taxIncluded: true,
    status: 'Online',
  });

  const [showInternalShortName, setShowInternalShortName] = useState(false);
  const [showFinePrint, setShowFinePrint] = useState(false);
  const [showHowToRedeem, setShowHowToRedeem] = useState(false);

  // Load item data if editing
  useEffect(() => {
    if (itemId) {
      const item = state.menuItems.find(i => i.id === itemId);
      if (item) {
        setFormData({
          name: item.name || '',
          image: null,
          imagePreview: item.image || null,
          tagline: item.tagline || '',
          description: item.description || '',
          internalShortName: item.internalShortName || '',
          finePrint: item.finePrint || '',
          howToRedeem: item.howToRedeem || '',
          onlineCategory: item.category || 'Courses',
          internalCategory: item.internalCategory || 'Courses',
          webId: item.webId || '',
          days: Array.isArray(item.days) ? item.days : [],
          meals: Array.isArray(item.meals) ? item.meals : [],
          price: item.price || '',
          originalPrice: item.originalPrice || '',
          showDiscount: item.showDiscount || false,
          taxIncluded: item.taxIncluded !== false,
          status: item.status || 'Online',
        });
        setShowInternalShortName(!!item.internalShortName);
        setShowFinePrint(!!item.finePrint);
        setShowHowToRedeem(!!item.howToRedeem);
      }
    }
  }, [itemId, state.menuItems]);

  // Click outside handler for social dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (socialDropdownRef.current && !socialDropdownRef.current.contains(event.target)) {
        setSocialDropdownOpen(false);
      }
    };

    if (socialDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [socialDropdownOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDay = (index) => {
    const dayLabel = DAY_LABELS[index];
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(dayLabel)
        ? prev.days.filter(d => d !== dayLabel)
        : [...prev.days, dayLabel],
    }));
  };

  const toggleMeal = (meal) => {
    setFormData(prev => ({
      ...prev,
      meals: prev.meals.includes(meal)
        ? prev.meals.filter(m => m !== meal)
        : [...prev.meals, meal],
    }));
  };

  const selectAllDays = () => {
    setFormData(prev => ({ ...prev, days: [...DAY_LABELS] }));
  };

  const clearAllDays = () => {
    setFormData(prev => ({ ...prev, days: [] }));
  };

  const selectAllMeals = () => {
    setFormData(prev => ({ ...prev, meals: [...MEALS] }));
  };

  const clearAllMeals = () => {
    setFormData(prev => ({ ...prev, meals: [] }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter an item name');
      return;
    }

    const itemData = {
      name: formData.name,
      image: formData.imagePreview,
      tagline: formData.tagline,
      description: formData.description,
      internalShortName: formData.internalShortName,
      finePrint: formData.finePrint,
      howToRedeem: formData.howToRedeem,
      category: formData.onlineCategory,
      internalCategory: formData.internalCategory,
      webId: formData.webId,
      days: formData.days,
      meals: formData.meals,
      price: parseFloat(formData.price) || 0,
      originalPrice: parseFloat(formData.originalPrice) || 0,
      showDiscount: formData.showDiscount,
      taxIncluded: formData.taxIncluded,
      status: formData.status,
    };

    if (itemId) {
      updateMenuItem(itemId, itemData);
    } else {
      addMenuItems([itemData]);
    }

    onClose();
  };

  const calculateDiscount = () => {
    const price = parseFloat(formData.price) || 0;
    const originalPrice = parseFloat(formData.originalPrice) || 0;
    if (originalPrice > price && price > 0) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/menu/${formData.webId || 'item-id'}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const handleCopySocialLink = (platform) => {
    const baseLink = `${window.location.origin}/menu/${formData.webId || 'item-id'}`;
    const utmLink = `${baseLink}?utm_source=${platform}&utm_medium=social`;
    navigator.clipboard.writeText(utmLink).then(() => {
      alert(`Link with ${platform} UTM tag copied to clipboard!`);
      setSocialDropdownOpen(false);
    });
  };

  const toggleSocialDropdown = () => {
    setSocialDropdownOpen(!socialDropdownOpen);
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="edit-modal-header">
          <div className="edit-modal-header-left">
            <button className="edit-modal-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h2 className="edit-modal-title">{itemId ? 'Edit Menu Item' : 'New Menu Item'}</h2>
          </div>
          <button className="button primary" onClick={handleSave}>
            Save
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="edit-modal-tabs">
          <button
            className={`edit-tab ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic
          </button>
          <button
            className={`edit-tab ${activeTab === 'booking-rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('booking-rules')}
          >
            Booking Rules
          </button>
          <button
            className={`edit-tab ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payments
          </button>
        </div>

        {/* Body - Two Column Layout */}
        <div className="edit-modal-body-wrapper">
          {/* Left Column: Form Content */}
          <div className="edit-modal-body">
            {activeTab === 'basic' && (
              <>
          {/* SECTION 1: Basic Details */}
          <div className="menu-item-form-panel">
            <div className="section-header">
              <div className="section-header-content">
                <h3 className="section-title">Basic Details</h3>
                <p className="section-description">General information about your menu item</p>
              </div>
              <div className="status-dropdown-wrapper">
                <button
                  className="status-dropdown-button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  style={{
                    background: formData.status === 'Online' ? 'var(--success-surface)' : 
                               formData.status === 'Hidden' ? 'var(--warning-surface)' :
                               formData.status === 'Manager Only' ? 'var(--info-surface)' : 'var(--neutral-surface)',
                    color: formData.status === 'Online' ? 'var(--success-text)' : 
                           formData.status === 'Hidden' ? 'var(--warning-text)' :
                           formData.status === 'Manager Only' ? 'var(--info-text)' : 'var(--neutral-text)',
                  }}
                >
                  {formData.status}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {statusDropdownOpen && (
                  <div className="edit-status-dropdown">
                    {['Online', 'Hidden', 'Manager Only', 'Disabled'].map(s => (
                      <button
                        key={s}
                        className="edit-status-option"
                        onClick={() => {
                          handleInputChange('status', s);
                          setStatusDropdownOpen(false);
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="menu-item-form-content">
              {/* Name */}
              <div className="form-field">
                <div className="form-label-group">
                  <label className="form-label">Name</label>
                </div>
                <div className="edit-input-with-lang">
                  <input
                    type="text"
                    className="edit-input"
                    placeholder="e.g. Caesar Salad"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  <button className="lang-button">EN</button>
                </div>
              </div>

              {/* Image */}
              <div className="form-field">
                <div className="form-label-group">
                  <label className="form-label">Image</label>
                  <div className="form-help-text">Recommended size: 1920 x 1080</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="edit-image-upload"
                />
                {formData.imagePreview ? (
                  <div className="edit-image-preview-container">
                    <img src={formData.imagePreview} alt="Preview" className="edit-image-preview" />
                    <button 
                      type="button" 
                      className="edit-image-delete-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleInputChange('image', null);
                        handleInputChange('imagePreview', null);
                        const fileInput = document.getElementById('edit-image-upload');
                        if (fileInput) fileInput.value = '';
                      }}
                      title="Delete image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label htmlFor="edit-image-upload" className="edit-upload-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p>Drop file or click to upload</p>
                  </label>
                )}
              </div>

              {/* Tagline */}
              <div className="edit-field">
                <label className="form-label">Tagline <span className="edit-optional">(Optional)</span></label>
                <p className="form-help-text">A quick preview of the item, appears below the name.</p>
                <div className="edit-input-with-lang">
                  <input
                    type="text"
                    className="edit-input"
                    placeholder="e.g. Crisp romaine with parmesan and croutons"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                  />
                  <button className="lang-button">EN</button>
                </div>
              </div>

              {/* Description */}
              <div className="edit-field">
                <label className="form-label">Description <span className="edit-optional">(Optional)</span></label>
                <p className="form-help-text">A more detailed description of the item.</p>
                <div className="edit-input-with-lang">
                  <textarea
                    className="edit-textarea"
                    rows="4"
                    placeholder="e.g. Fresh romaine lettuce tossed with creamy Caesar dressing, garlic croutons, and shaved Parmesan cheese"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                  <button className="lang-button lang-button-textarea">EN</button>
                </div>
              </div>

              {/* Expandable fields */}
              <div className="edit-expandable-actions">
                {!showInternalShortName && (
                  <button className="edit-inline-button" onClick={() => setShowInternalShortName(true)}>
                    + Internal Short Name
                  </button>
                )}
                {!showFinePrint && (
                  <button className="edit-inline-button" onClick={() => setShowFinePrint(true)}>
                    + Fine Print
                  </button>
                )}
                {!showHowToRedeem && (
                  <button className="edit-inline-button" onClick={() => setShowHowToRedeem(true)}>
                    + How to Redeem
                  </button>
                )}
              </div>

              {showInternalShortName && (
                <div className="edit-field">
                  <label className="form-label">Internal Short Name</label>
                  <input
                    type="text"
                    className="edit-input"
                    value={formData.internalShortName}
                    onChange={(e) => handleInputChange('internalShortName', e.target.value)}
                  />
                </div>
              )}

              {showFinePrint && (
                <div className="edit-field">
                  <label className="form-label">Fine Print</label>
                  <div className="edit-input-with-lang">
                    <textarea
                      className="edit-textarea"
                      rows="3"
                      value={formData.finePrint}
                      onChange={(e) => handleInputChange('finePrint', e.target.value)}
                    />
                    <button className="lang-button lang-button-textarea">EN</button>
                  </div>
                </div>
              )}

              {showHowToRedeem && (
                <div className="edit-field">
                  <label className="form-label">How to Redeem</label>
                  <div className="edit-input-with-lang">
                    <textarea
                      className="edit-textarea"
                      rows="3"
                      value={formData.howToRedeem}
                      onChange={(e) => handleInputChange('howToRedeem', e.target.value)}
                    />
                    <button className="lang-button lang-button-textarea">EN</button>
                  </div>
                </div>
              )}

              {/* Divider before categories */}
              <div className="form-divider"></div>

              {/* Categories */}
              <div className="edit-field-row">
                <div className="edit-field">
                  <label className="form-label">Online Category</label>
                  <p className="edit-sublabel">Guest-facing category</p>
                  <select
                    className="edit-select"
                    value={formData.onlineCategory}
                    onChange={(e) => handleInputChange('onlineCategory', e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="edit-field">
                  <label className="form-label">Internal Category</label>
                  <p className="edit-sublabel">Staff-facing category</p>
                  <select
                    className="edit-select"
                    value={formData.internalCategory}
                    onChange={(e) => handleInputChange('internalCategory', e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-divider"></div>

              {/* Web ID */}
              <div className="form-field">
                <div className="form-label-group">
                  <label className="form-label">Web ID <span className="optional-label">(Optional)</span></label>
                  <div className="form-help-text">Will appear in the URL for your menu item</div>
                </div>
                <input
                  type="text"
                  className="edit-input"
                  placeholder="caesar-salad"
                  value={formData.webId}
                  onChange={(e) => handleInputChange('webId', e.target.value)}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Availability */}
          <div className="menu-item-form-panel">
            <div className="section-header">
              <div className="section-header-content">
                <h3 className="section-title">Availability</h3>
                <p className="section-description">Set when this menu item be available to order</p>
              </div>
            </div>

            <div className="menu-item-form-content">
              {/* Days */}
              <div className="edit-field">
                <div className="edit-field-header">
                  <label className="form-label">Days</label>
                  <div className="edit-quick-actions">
                    <button className="edit-text-action-small" onClick={selectAllDays}>Select All</button>
                    <span className="edit-separator">|</span>
                    <button className="edit-text-action-small" onClick={clearAllDays}>None</button>
                  </div>
                </div>
                <div className="edit-toggle-group">
                  {DAYS.map((day, index) => (
                    <button
                      key={day}
                      className={`edit-toggle-button ${formData.days.includes(DAY_LABELS[index]) ? 'active' : ''}`}
                      onClick={() => toggleDay(index)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meals */}
              <div className="edit-field">
                <div className="edit-field-header">
                  <label className="form-label">Meal Periods</label>
                  <div className="edit-quick-actions">
                    <button className="edit-text-action-small" onClick={selectAllMeals}>Select All</button>
                    <span className="edit-separator">|</span>
                    <button className="edit-text-action-small" onClick={clearAllMeals}>None</button>
                  </div>
                </div>
                <div className="edit-toggle-group">
                  {MEALS.map(meal => (
                    <button
                      key={meal}
                      className={`edit-toggle-button ${formData.meals.includes(meal) ? 'active' : ''}`}
                      onClick={() => toggleMeal(meal)}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Price & Tax */}
          <div className="menu-item-form-panel">
            <div className="section-header">
              <div className="section-header-content">
                <h3 className="section-title">Price & Tax</h3>
                <p className="section-description">Set the price and tax information for this item</p>
              </div>
            </div>

            <div className="menu-item-form-content">
              <div className="edit-field">
                <label className="form-label">Price</label>
                <div className="edit-currency-input">
                  <span className="edit-currency-prefix">JPY</span>
                  <input
                    type="number"
                    className="edit-input edit-input-currency"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="edit-field">
                <label className="form-label">Original Price <span className="edit-optional">(Optional)</span></label>
                <p className="form-help-text">Enter a higher amount to show a price markdown.</p>
                <div className="edit-currency-input">
                  <span className="edit-currency-prefix">JPY</span>
                  <input
                    type="number"
                    className="edit-input edit-input-currency"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="edit-checkbox">
                <input
                  type="checkbox"
                  id="showDiscount"
                  checked={formData.showDiscount}
                  onChange={(e) => handleInputChange('showDiscount', e.target.checked)}
                />
                <label htmlFor="showDiscount">Show discount on booking form</label>
              </div>

              <button className="edit-text-action" onClick={() => setShowTaxOptions(!showTaxOptions)}>
                {showTaxOptions ? 'Hide tax options' : 'Show tax options'}
              </button>

              {showTaxOptions && (
                <div className="edit-field" style={{ marginTop: '12px' }}>
                  <div className="edit-checkbox">
                    <input
                      type="checkbox"
                      id="taxIncluded"
                      checked={formData.taxIncluded}
                      onChange={(e) => handleInputChange('taxIncluded', e.target.checked)}
                    />
                    <label htmlFor="taxIncluded">Tax included in price</label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: Questions */}
          <div className="menu-item-form-panel">
            <div className="section-header">
              <div className="section-header-content">
                <h3 className="section-title">Questions</h3>
                <p className="section-description">Important things to ask guests who order this item.</p>
              </div>
            </div>

            <div className="menu-item-form-content">
              <div className="edit-ghost-buttons">
                <button className="edit-ghost-button">+ Question 1</button>
                <button className="edit-ghost-button">+ Question 2</button>
              </div>
            </div>
          </div>

          {/* SECTION 5: Advanced Settings */}
          <div className="menu-item-form-panel">
            <button
              className="section-header section-header-collapsible"
              onClick={() => setAdvancedExpanded(!advancedExpanded)}
            >
              <div className="section-header-content">
                <h3 className="section-title">Advanced Settings</h3>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ transform: advancedExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {advancedExpanded && (
              <div className="menu-item-form-content">
                <p className="edit-help-text">Advanced options coming soon...</p>
              </div>
            )}
          </div>
            </>
          )}

          {/* Booking Rules Tab */}
          {activeTab === 'booking-rules' && (
            <div className="edit-section">
              <div className="edit-section-content">
                <p className="form-help-text">Booking rules configuration coming soon...</p>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="edit-section">
              <div className="edit-section-content">
                <p className="form-help-text">Payment options configuration coming soon...</p>
              </div>
            </div>
          )}
        </div>

          {/* Right Column: Preview */}
          <div className="edit-modal-preview">
            {/* Preview Card */}
            <div className="preview-card">
              <div className="preview-card-badge">PREVIEW</div>
              {formData.imagePreview ? (
                <div className="preview-card-image">
                  <img src={formData.imagePreview} alt={formData.name || 'Menu item'} />
                </div>
              ) : (
                <div className="preview-card-image preview-card-image-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              )}

              <div className="preview-card-content">
                <h3 className="preview-card-title">
                  {formData.name || 'Menu Item Name'}
                </h3>
                
                {formData.tagline && (
                  <p className="preview-card-tagline">{formData.tagline}</p>
                )}

                <div className="preview-card-price">
                  <span className="preview-price-current">
                    ¥{parseFloat(formData.price) || 0}
                  </span>
                  
                  {formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
                    <>
                      <span className="preview-price-original">
                        ¥{parseFloat(formData.originalPrice)}
                      </span>
                      {calculateDiscount() > 0 && (
                        <span className="preview-discount-badge">
                          {calculateDiscount()}% off
                        </span>
                      )}
                    </>
                  )}

                  {formData.taxIncluded && (
                    <span className="preview-tax-info">Tax incl.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="preview-actions">
              <label className="preview-actions-label">Link to Booking Form</label>
              <div className="preview-actions-link">
                https://app.tablecheck.com/a24/reserve?menu_items[]=6502990c2bbae202d14beab3
              </div>
              <button className="preview-action-button" onClick={handleCopyLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy link
              </button>
              
              <div className="social-share-dropdown" ref={socialDropdownRef}>
                <button className="preview-action-button" onClick={toggleSocialDropdown}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Copy with social tag
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                {socialDropdownOpen && (
                  <div className="social-share-options">
                    <button className="social-option" onClick={() => handleCopySocialLink('facebook')}>
                      Facebook
                    </button>
                    <button className="social-option" onClick={() => handleCopySocialLink('twitter')}>
                      Twitter
                    </button>
                    <button className="social-option" onClick={() => handleCopySocialLink('instagram')}>
                      Instagram
                    </button>
                    <button className="social-option" onClick={() => handleCopySocialLink('linkedin')}>
                      LinkedIn
                    </button>
                    <button className="social-option" onClick={() => handleCopySocialLink('tiktok')}>
                      TikTok
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditMenuItemModal;

