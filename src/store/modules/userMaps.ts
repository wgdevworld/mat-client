import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Coordinate, MatMap, MatZip} from '../../types/store';
import {calculateDistance} from '../../tools/CommonFunc';
import {Alert} from 'react-native';

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
      if (
        state.ownMaps[0].zipList.find(zip => {
          action.payload.find(newZip => newZip.id === zip.id);
        })
      ) {
        Alert.alert('이미 추가하신 맛집입니다!');
      }
      state.ownMaps[0].zipList = action.payload;
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
} = userMapsSlice.actions;
export default userMapsSlice.reducer;
