import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {MatMap} from '../../types/store';

export const initialState: {maps: MatMap[]} = {
  maps: [],
};

export const publicMapSlice = createSlice({
  name: 'publicMaps',
  initialState,
  reducers: {
    replacePublicMapsAction: (state, action: PayloadAction<MatMap[]>) => {
      state.maps = action.payload;
      return state;
    },
  },
});

export const {replacePublicMapsAction} = publicMapSlice.actions;

export default publicMapSlice.reducer;
