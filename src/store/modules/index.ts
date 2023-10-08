import {combineReducers} from '@reduxjs/toolkit';
import matZip, {initialState as matZipInitialState} from './matZip';
import user, {initialState as userInitialState} from './user';
import matMap, {initialState as matMapInitialState} from './matMap';
import userMaps, {initialState as userMapsInitialState} from './userMaps';
import userMuckitems, {initialState as itemsInitialState} from './userItems';
import publicMaps, {initialState as publicMapsInitialState} from './publicMaps';

const rootReducer = combineReducers({user, matZip, matMap, userMaps, userMuckitems, publicMaps});

export const initialStateObject: {
  [key: string]: any;
} = {
  user: userInitialState,
  userMaps: userMapsInitialState,
  matZip: matZipInitialState,
  matMap: matMapInitialState,
  userMuckitems: itemsInitialState,
  publicMaps: publicMapsInitialState
};

export default rootReducer;
