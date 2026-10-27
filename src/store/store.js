import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import pantryReducer, { itemAdded, itemUpdated, itemDeleted, staplesRestored, savePantry } from './pantrySlice';
import timerReducer, { timersTicked, timerNotified } from './timerSlice';
import uiReducer, { toastAdded, toastRemoved } from './uiSlice';
import { playTimerBell } from '../utils/sound';

const listenerMiddleware = createListenerMiddleware();

const TOAST_LIFETIME_MS = 4000;

listenerMiddleware.startListening({
  actionCreator: toastAdded,
  effect: async (action, api) => {
    await api.delay(TOAST_LIFETIME_MS);
    api.dispatch(toastRemoved(action.payload.id));
  }
});

listenerMiddleware.startListening({
  actionCreator: timersTicked,
  effect: (action, api) => {
    const { timers } = api.getState().timers;
    timers
      .filter(timer => timer.status === 'finished' && !timer.notified)
      .forEach(timer => {
        playTimerBell();
        api.dispatch(timerNotified(timer.id));
        api.dispatch(toastAdded(`⏰ Timer Alert! "${timer.name}" completed!`, 'warning'));
      });
  }
});

listenerMiddleware.startListening({
  actionCreator: itemAdded,
  effect: (action, api) => {
    api.dispatch(toastAdded(`Added "${action.payload.name}" to pantry`, 'success'));
  }
});

listenerMiddleware.startListening({
  actionCreator: itemUpdated,
  effect: (action, api) => {
    api.dispatch(toastAdded('Updated pantry item', 'info'));
  }
});

listenerMiddleware.startListening({
  actionCreator: itemDeleted,
  effect: (action, api) => {
    api.dispatch(toastAdded(`Removed "${action.payload.name}" from pantry`, 'info'));
  }
});

listenerMiddleware.startListening({
  actionCreator: staplesRestored,
  effect: (action, api) => {
    api.dispatch(toastAdded('Restored common kitchen staples to pantry', 'success'));
  }
});

export const store = configureStore({
  reducer: {
    pantry: pantryReducer,
    timers: timerReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware)
});

let lastPantryItems = store.getState().pantry.items;

store.subscribe(() => {
  const items = store.getState().pantry.items;
  if (items !== lastPantryItems) {
    lastPantryItems = items;
    savePantry(items);
  }
});
