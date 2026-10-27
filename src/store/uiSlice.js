import { createSlice, nanoid } from '@reduxjs/toolkit';
import { DEFAULT_RECIPES } from '../data/recipes';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    currentPage: 'home',
    activeRecipeId: DEFAULT_RECIPES[0].id,
    isTimerDrawerOpen: false,
    toasts: []
  },
  reducers: {
    pageChanged(state, action) {
      state.currentPage = action.payload;
    },
    cookingStarted(state, action) {
      state.activeRecipeId = action.payload;
      state.currentPage = 'cooking';
    },
    drawerOpened(state) {
      state.isTimerDrawerOpen = true;
    },
    drawerClosed(state) {
      state.isTimerDrawerOpen = false;
    },
    toastAdded: {
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare(message, type = 'info') {
        return { payload: { id: nanoid(), message, type } };
      }
    },
    toastRemoved(state, action) {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    }
  }
});

export const {
  pageChanged,
  cookingStarted,
  drawerOpened,
  drawerClosed,
  toastAdded,
  toastRemoved
} = uiSlice.actions;

export default uiSlice.reducer;
