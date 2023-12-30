import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {GlobalComponent} from '../../types/store';

export const initialState: GlobalComponent = {
  isLoading: false,
  isFromSocial: false,
};

export const zipSlice = createSlice({
  name: 'globalComponent',
  initialState,
  reducers: {
    updateIsLoadingAction: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      return state;
    },
    updateIsFromSocialAction: (state, action: PayloadAction<boolean>) => {
      state.isFromSocial = action.payload;
      return state;
    },
  },
});

export const {updateIsLoadingAction, updateIsFromSocialAction} =
  zipSlice.actions;
export default zipSlice.reducer;
