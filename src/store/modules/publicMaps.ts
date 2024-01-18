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
    addPublicMapFollowerCountAction: (state, action: PayloadAction<string>) => {
      const targetMap = state.maps.find(map => map.id === action.payload);
      if (targetMap) {
        targetMap.numFollower! += 1;
      }
      return state;
    },
  },
});

export const {replacePublicMapsAction, addPublicMapFollowerCountAction} =
  publicMapSlice.actions;

export default publicMapSlice.reducer;
