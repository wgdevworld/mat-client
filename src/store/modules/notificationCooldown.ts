import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface NotificationState {
  lastNotified: {[key: string]: number};
}

export const initialState: NotificationState = {
  lastNotified: {},
};

const notificationCooldownSlice = createSlice({
  name: 'notificationCooldown',
  initialState,
  reducers: {
    setLastNotified(
      state,
      action: PayloadAction<{zipName: string; timestamp: number}>,
    ) {
      const {zipName, timestamp} = action.payload;
      state.lastNotified[zipName] = timestamp;
    },
    cleanupCooldowns(state, action: PayloadAction<number>) {
      const now = Date.now();
      Object.keys(state.lastNotified).forEach(zipName => {
        if (now - state.lastNotified[zipName] > action.payload) {
          delete state.lastNotified[zipName];
        }
      });
      return state;
    },
  },
});

export const {setLastNotified, cleanupCooldowns} =
  notificationCooldownSlice.actions;
export default notificationCooldownSlice.reducer;
