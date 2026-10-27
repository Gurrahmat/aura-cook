import { createSlice } from '@reduxjs/toolkit';

const timerSlice = createSlice({
  name: 'timers',
  initialState: { timers: [] },
  reducers: {
    timerAdded: {
      reducer(state, action) {
        state.timers.push(action.payload);
      },
      prepare({ name, durationSeconds }) {
        return {
          payload: {
            id: `timer_${Date.now()}`,
            name: name || 'Kitchen Timer',
            totalSeconds: durationSeconds,
            remainingSeconds: durationSeconds,
            status: 'running',
            notified: false
          }
        };
      }
    },
    timerToggled(state, action) {
      const timer = state.timers.find(t => t.id === action.payload);
      if (!timer) return;
      if (timer.status === 'running') timer.status = 'paused';
      else if (timer.remainingSeconds > 0) timer.status = 'running';
      else timer.status = 'finished';
    },
    timerReset(state, action) {
      const timer = state.timers.find(t => t.id === action.payload);
      if (!timer) return;
      timer.remainingSeconds = timer.totalSeconds;
      timer.status = 'paused';
      timer.notified = false;
    },
    timerRemoved(state, action) {
      state.timers = state.timers.filter(t => t.id !== action.payload);
    },
    timersTicked(state) {
      state.timers.forEach(timer => {
        if (timer.status !== 'running') return;
        timer.remainingSeconds = Math.max(0, timer.remainingSeconds - 1);
        if (timer.remainingSeconds === 0) timer.status = 'finished';
      });
    },
    timerNotified(state, action) {
      const timer = state.timers.find(t => t.id === action.payload);
      if (timer) timer.notified = true;
    }
  }
});

export const {
  timerAdded,
  timerToggled,
  timerReset,
  timerRemoved,
  timersTicked,
  timerNotified
} = timerSlice.actions;

export default timerSlice.reducer;
