import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MatMap, MatZip} from '../../types/store';

export const initialState: {MatMap: MatMap} = {
  MatMap: {
    id: '',
    name: '',
    author: '',
    numFollower: 0,
    publicStatus: false,
    areaCode: '',
    zipList: [],
    followerList: [],
  },
};

export const zipSlice = createSlice({
  name: 'matMap',
  initialState,
  reducers: {
    addMatZipAction: (state, action: PayloadAction<MatZip>) => {
      state = {...state, ...action.payload};
      return state;
    },
    removeMatZipAction: (state, action: PayloadAction<MatZip>) => {
      const zipToRemove = action.payload;
      const updatedZipList = state.MatMap.zipList.filter(
        zip => zip.id !== zipToRemove.id,
      );
      state.MatMap.zipList = updatedZipList;
      return state;
    },
  },
});

export const {addMatZipAction, removeMatZipAction} = zipSlice.actions;
export default zipSlice.reducer;
