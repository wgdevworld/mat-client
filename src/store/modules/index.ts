import {combineReducers} from '@reduxjs/toolkit';
import matZip, {initialState as matZipInitialState} from './matZip';
import user, {initialState as userInitialState} from './user';
import matMap, {initialState as matMapInitialState} from './matMap';
import userMaps, {initialState as userMapsInitialState} from './userMaps';

const rootReducer = combineReducers({user, matZip, matMap, userMaps});

export const initialStateObject: {
  [key: string]: any;
} = {
  user: userInitialState,
  userMaps: userMapsInitialState,
  matZip: matZipInitialState,
  matMap: matMapInitialState,
};

export default rootReducer;
