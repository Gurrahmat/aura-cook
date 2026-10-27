import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_PANTRY } from '../data/defaultPantry';

const STORAGE_KEY = 'auracook_pantry_react';

const clampQuantity = (value) => Math.max(0, parseFloat(value) || 0);

const normalize = (item) => {
  const quantity = clampQuantity(item.quantity);
  return {
    ...item,
    quantity,
    status: quantity === 0 ? 'Out of Stock' : (item.status || 'In Stock')
  };
};

export const loadPantry = () => {
  if (typeof localStorage === 'undefined') return DEFAULT_PANTRY;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error('Could not read the saved pantry', error);
  }
  return DEFAULT_PANTRY;
};

export const savePantry = (items) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Could not save the pantry', error);
  }
};

const pantrySlice = createSlice({
  name: 'pantry',
  initialState: { items: loadPantry() },
  reducers: {
    itemAdded: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(item) {
        return { payload: normalize({ ...item, id: `p_${Date.now()}` }) };
      }
    },
    itemUpdated(state, action) {
      const { id, fields } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = normalize({ ...state.items[index], ...fields });
      }
    },
    itemDeleted(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    staplesRestored(state) {
      state.items = DEFAULT_PANTRY;
    }
  }
});

export const { itemAdded, itemUpdated, itemDeleted, staplesRestored } = pantrySlice.actions;
export default pantrySlice.reducer;
