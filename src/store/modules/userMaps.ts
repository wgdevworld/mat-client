import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Coordinate, MatMap, MatZip} from '../../types/store';
import {calculateDistance} from '../../tools/CommonFunc';

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
    removeFromOwnMatMapAction: (state, action: PayloadAction<string>) => {
      const targetZip = state.ownMaps[0].zipList.find(
        zip => zip.id === action.payload,
      );
      if (targetZip) {
        state.ownMaps[0].zipList = state.ownMaps[0].zipList.filter(
          map => map.id !== action.payload,
        );
      }
      return state;
    },
    followMatMapAction: (state, action: PayloadAction<MatMap[]>) => {
      state.followingMaps.push(...action.payload);
      return state;
    },
    replaceFollowingMatMapAction: (state, action: PayloadAction<MatMap[]>) => {
      state.followingMaps = action.payload;
      return state;
    },
    addFollowingMatMapAction: (state, action: PayloadAction<MatMap>) => {
      state.followingMaps.push(action.payload);
      return state;
    },
    removeFollowingMatMapAction: (state, action: PayloadAction<string>) => {
      state.followingMaps = state.followingMaps.filter(
        map => map.id !== action.payload,
      );
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
    incrementReviewCountAndAverageAction: (
      state,
      action: PayloadAction<[string, number]>,
    ) => {
      const [zipId, reviewAvgRating] = action.payload;
      const targetZipFromOwnMap = state.ownMaps[0]?.zipList.find(
        (zip: MatZip) => zip.id === zipId,
      );
      if (targetZipFromOwnMap) {
        console.log('incrementing for own map');
        targetZipFromOwnMap.reviewCount += 1;
        targetZipFromOwnMap.reviewAvgRating = reviewAvgRating;
      }
      state.followingMaps.forEach(map => {
        const targetZipFromFollowingMap = map.zipList.find(
          (zip: MatZip) => zip.id === zipId,
        );
        if (targetZipFromFollowingMap) {
          console.log('incrementing for following map');
          targetZipFromFollowingMap.reviewCount += 1;
          targetZipFromFollowingMap.reviewAvgRating = reviewAvgRating;
        }
      });
      return state;
    },
    updatePublicStatusAction: (state, action: PayloadAction<boolean>) => {
      state.ownMaps[0].publicStatus = action.payload;
      return state;
    },
    updateOwnMapImgAction: (state, action: PayloadAction<string>) => {
      state.ownMaps[0].imageSrc = [action.payload];
      return state;
    },
    updateOwnMapNameAction: (state, action: PayloadAction<string>) => {
      state.ownMaps[0].name = action.payload;
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
  replaceFollowingMatMapAction,
  addFollowingMatMapAction,
  removeFollowingMatMapAction,
  removeFromOwnMatMapAction,
  incrementReviewCountAndAverageAction,
  updatePublicStatusAction,
  updateOwnMapImgAction,
  updateOwnMapNameAction,
} = userMapsSlice.actions;
export default userMapsSlice.reducer;
