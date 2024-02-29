import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface NotificationState {
  lastNotified: {[key: string]: number};
}

export const initialState: NotificationState = {
  lastNotified: {},
};

export const COOLDOWN_TIME = 0.1 * 60 * 1000; // 5 minutes

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
    cleanupCooldowns(state) {
      const now = Date.now();
      Object.keys(state.lastNotified).forEach(zipName => {
        if (now - state.lastNotified[zipName] > COOLDOWN_TIME) {
          delete state.lastNotified[zipName];
        }
      });
    },
  },
});

export const {setLastNotified, cleanupCooldowns} =
  notificationCooldownSlice.actions;
export default notificationCooldownSlice.reducer;
