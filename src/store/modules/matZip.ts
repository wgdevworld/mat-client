import {calculateDistance} from '../../tools/CommonFunc';
import {Coordinate, MatZip, Review} from '../../types/store';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export const initialState: MatZip = {
  id: '',
  name: '',
  reviews: [],
  coordinate: {latitude: 0, longitude: 0},
  address: '',
  distance: 0,
  isVisited: false,
  category: '',
};

export const matZipSlice = createSlice({
  name: 'matZip',
  initialState,
  reducers: {
    addMatZipReviewAction: (state, action: PayloadAction<Review>) => {
      state = {...state, ...action.payload};
      return state;
    },
    updateDistancetoMatZipAction: (
      state,
      action: PayloadAction<Coordinate>,
    ) => {
      state = {
        ...state,
        distance: calculateDistance(state.coordinate, action.payload),
      };
      return state;
    },
  },
});

export const {addMatZipReviewAction, updateDistancetoMatZipAction} =
  matZipSlice.actions;
export default matZipSlice.reducer;
