import {combineReducers} from '@reduxjs/toolkit';
import user, {initialState as userInitialState} from './user';
import matMap, {initialState as matMapInitialState} from './matMap';
import userMaps, {initialState as userMapsInitialState} from './userMaps';
import userMuckitems, {initialState as itemsInitialState} from './userItems';
import publicMaps, {initialState as publicMapsInitialState} from './publicMaps';
import globalComponents, {
  initialState as globalComponentsInitialState,
} from './globalComponent';
import visitedZips, {
  initialState as visitedZipsInitialState,
} from './visitedZips';
import notificationCooldown, {
  initialState as notificationCooldownInitialState,
} from './notificationCooldown';

const rootReducer = combineReducers({
  user,
  matMap,
  userMaps,
  userMuckitems,
  publicMaps,
  globalComponents,
  visitedZips,
  notificationCooldown,
});

export const initialStateObject: {
  [key: string]: any;
} = {
  user: userInitialState,
  userMaps: userMapsInitialState,
  matMap: matMapInitialState,
  userMuckitems: itemsInitialState,
  publicMaps: publicMapsInitialState,
  globalComponents: globalComponentsInitialState,
  visitedZips: visitedZipsInitialState,
  notificationCooldown: notificationCooldownInitialState,
};

export default rootReducer;
