import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Coordinate, MatMap, MatZip} from '../../types/store';
import {calculateDistance} from '../../tools/CommonFunc';

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
      const ziptoAdd = action.payload;
      state.MatMap.zipList.push(ziptoAdd);
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
    updateDistanceForMatMapAction: (
      state,
      action: PayloadAction<Coordinate>,
    ) => {
      state.MatMap.zipList.forEach(zipItem => {
        zipItem.distance = calculateDistance(
          zipItem.coordinate,
          action.payload,
        );
      });
    },
  },
});

export const {
  addMatZipAction,
  removeMatZipAction,
  updateDistanceForMatMapAction,
} = zipSlice.actions;
export default zipSlice.reducer;
