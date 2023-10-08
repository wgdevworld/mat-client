import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Coordinate, MatMap, MatZip, Review} from '../../types/store';
import {calculateDistance, ratingAverage} from '../../tools/CommonFunc';

export const initialState: {ownMaps: MatMap[]; followingMaps: MatMap[]} = {
  ownMaps: [],
  followingMaps: [],
};

export const userMapsSlice = createSlice({
  name: 'userMaps',
  initialState,
  reducers: {
    replaceOwnMatMapAction: (state, action: PayloadAction<MatMap[]>) => {
      state.ownMaps = action.payload;
      return state;
    },
    addOwnMatMapAction: (state, action: PayloadAction<MatMap[]>) => {
      state.ownMaps.push(...action.payload);
      return state;
    },
    followMatMapAction: (state, action: PayloadAction<MatMap[]>) => {
      state.followingMaps.push(...action.payload);
      return state;
    },
    addMatZipAction: (
      state,
      action: PayloadAction<{mapId?: string; zip: MatZip}>,
    ) => {
      const {mapId, zip} = action.payload;
      if (!mapId) {
        console.log('🚨 mapId is not defined');
        return;
      }
      const targetMap =
        state.ownMaps.find(map => map.id === mapId) ||
        state.followingMaps.find(map => map.id === mapId);
      targetMap?.zipList?.push(zip);
      return state;
    },
    updateDistanceForMatMapAction: (
      state,
      action: PayloadAction<{mapId?: string; myLocation: Coordinate}>,
    ) => {
      const {mapId, myLocation} = action.payload;
      const targetMap =
        state.ownMaps.find(map => map.id === mapId) ||
        state.followingMaps.find(map => map.id === mapId);
      targetMap?.zipList?.forEach((zip: MatZip) => {
        zip.distance = calculateDistance(zip.coordinate, myLocation);
      });
      return state;
    },
    replaceOwnMatMapZipListAction: (state, action: PayloadAction<MatZip[]>) => {
      state.ownMaps[0].zipList = action.payload;
      return state;
    },
    addReviewAction: (
      state,
      action: PayloadAction<{review: Review[]; zipId?: string}>,
    ) => {
      if (!action.payload.zipId) {
        return;
      }
      const targetZip = state.ownMaps[0].zipList.find(
        (zip: MatZip) => zip.id === action.payload.zipId,
      );
      if (targetZip) {
        console.log('ℹ️ updating review list');
        targetZip.reviews = action.payload.review;
        console.log(targetZip.reviews.length);
        targetZip.reviewCount = targetZip.reviews.length;
        targetZip.reviewAvgRating = ratingAverage(targetZip.reviews);
      }
      return state;
    },
  },
});

export const {
  replaceOwnMatMapZipListAction,
  replaceOwnMatMapAction,
  addOwnMatMapAction,
  followMatMapAction,
  addMatZipAction,
  updateDistanceForMatMapAction,
  addReviewAction,
} = userMapsSlice.actions;
export default userMapsSlice.reducer;
