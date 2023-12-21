import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {MatZip} from '../../types/store';

export const initialState: {visitedZips: MatZip[]} = {
  visitedZips: [],
};

export const visitedZipsSlice = createSlice({
  name: 'visitedZips',
  initialState,
  reducers: {
    replaceVisitedMatZipsAction: (state, action: PayloadAction<MatZip[]>) => {
      state.visitedZips = action.payload;
      return state;
    },
    addVisitedMatZipAction: (
      state,
      action: PayloadAction<MatZip | undefined>,
    ) => {
      if (!action.payload) {
        return;
      }
      state.visitedZips.push(action.payload);
      return state;
    },
    removeVisitedZipAction: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      if (!action.payload) {
        return;
      }
      const targetZip = state.visitedZips.find(
        zip => zip.id === action.payload,
      );
      if (targetZip) {
        state.visitedZips = state.visitedZips.filter(
          zip => zip.id !== action.payload,
        );
      }
      return state;
    },
  },
});

export const {
  replaceVisitedMatZipsAction,
  addVisitedMatZipAction,
  removeVisitedZipAction,
} = visitedZipsSlice.actions;
export default visitedZipsSlice.reducer;
