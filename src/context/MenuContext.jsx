import React, { createContext, useContext, useReducer, useEffect } from 'react';
import menuItemsData from '../menu-items.json';
import { useToast } from './ToastContext';

const MenuContext = createContext();

// Action types
export const ACTIONS = {
  SET_MENU_ITEMS: 'SET_MENU_ITEMS',
  ADD_MENU_ITEMS: 'ADD_MENU_ITEMS',
  UPDATE_MENU_ITEM: 'UPDATE_MENU_ITEM',
  DELETE_MENU_ITEM: 'DELETE_MENU_ITEM',
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  SET_SELECTED_ITEMS: 'SET_SELECTED_ITEMS',
  TOGGLE_ITEM_SELECTION: 'TOGGLE_ITEM_SELECTION',
  SET_FILTERS: 'SET_FILTERS',
  SET_SEARCH: 'SET_SEARCH',
  SET_SORT: 'SET_SORT',
};

// Initial state
const initialState = {
  menuItems: menuItemsData.menuItems || [],
  viewMode: 'table', // 'table' or 'cards'
  selectedItems: [],
  filters: {
    category: [],
    status: [],
    meals: [],
    days: [],
  },
  searchQuery: '',
  sortBy: 'name',
  sortOrder: 'asc',
};

// Reducer function
function menuReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_MENU_ITEMS:
      return {
        ...state,
        menuItems: action.payload,
      };

    case ACTIONS.ADD_MENU_ITEMS:
      const newItems = action.payload.map((item, index) => ({
        ...item,
        id: `item-${Date.now()}-${index}`,
        webId: `WEB-${Math.floor(Math.random() * 10000)}`,
      }));
      return {
        ...state,
        menuItems: [...state.menuItems, ...newItems],
      };

    case ACTIONS.UPDATE_MENU_ITEM:
      return {
        ...state,
        menuItems: state.menuItems.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        ),
      };

    case ACTIONS.DELETE_MENU_ITEM:
      return {
        ...state,
        menuItems: state.menuItems.filter((item) => item.id !== action.payload),
        selectedItems: state.selectedItems.filter((id) => id !== action.payload),
      };

    case ACTIONS.SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload,
      };

    case ACTIONS.SET_SELECTED_ITEMS:
      return {
        ...state,
        selectedItems: action.payload,
      };

    case ACTIONS.TOGGLE_ITEM_SELECTION:
      const itemId = action.payload;
      const isSelected = state.selectedItems.includes(itemId);
      return {
        ...state,
        selectedItems: isSelected
          ? state.selectedItems.filter((id) => id !== itemId)
          : [...state.selectedItems, itemId],
      };

    case ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case ACTIONS.SET_SEARCH:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
      };

    default:
      return state;
  }
}

// Provider component
export function MenuProvider({ children }) {
  const [state, dispatch] = useReducer(menuReducer, initialState);
  const toast = useToast();

  // Persist to localStorage when menu items change
  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(state.menuItems));
  }, [state.menuItems]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('menuItems');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: ACTIONS.SET_MENU_ITEMS, payload: parsed });
      } catch (error) {
        console.error('Failed to parse saved menu items:', error);
      }
    }
  }, []);

  const value = {
    state,
    dispatch,
    // Helper functions
    addMenuItems: (items) => {
      dispatch({ type: ACTIONS.ADD_MENU_ITEMS, payload: items });
      toast.success(`${items.length} item${items.length > 1 ? 's' : ''} added successfully`);
    },
    updateMenuItem: (id, updates) => {
      dispatch({ type: ACTIONS.UPDATE_MENU_ITEM, payload: { id, updates } });
      toast.success('Item updated successfully');
    },
    deleteMenuItem: (id) => {
      dispatch({ type: ACTIONS.DELETE_MENU_ITEM, payload: id });
      toast.success('Item deleted successfully');
    },
    setViewMode: (mode) => dispatch({ type: ACTIONS.SET_VIEW_MODE, payload: mode }),
    toggleItemSelection: (id) => dispatch({ type: ACTIONS.TOGGLE_ITEM_SELECTION, payload: id }),
    setSelectedItems: (ids) => dispatch({ type: ACTIONS.SET_SELECTED_ITEMS, payload: ids }),
    setFilters: (filters) => dispatch({ type: ACTIONS.SET_FILTERS, payload: filters }),
    setSearch: (query) => dispatch({ type: ACTIONS.SET_SEARCH, payload: query }),
    setSort: (sortBy, sortOrder) =>
      dispatch({ type: ACTIONS.SET_SORT, payload: { sortBy, sortOrder } }),
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

// Custom hook to use the menu context
export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}

