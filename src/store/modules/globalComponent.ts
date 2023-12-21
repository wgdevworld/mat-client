import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {GlobalComponent} from '../../types/store';

export const initialState: GlobalComponent = {
  isLoading: false,
};

export const zipSlice = createSlice({
  name: 'globalComponent',
  initialState,
  reducers: {
    updateIsLoadingAction: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      return state;
    },
  },
});

export const {updateIsLoadingAction} = zipSlice.actions;
export default zipSlice.reducer;
