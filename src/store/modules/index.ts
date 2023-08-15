import {combineReducers} from '@reduxjs/toolkit';
import matZip, {initialState as matZipInitialState} from './matZip';
import user, {initialState as userInitialState} from './user';
import matMap, {initialState as matMapInitialState} from './matMap';

const rootReducer = combineReducers({user, matZip, matMap});

export const initialStateObject: {
  [key: string]: any;
} = {
  user: userInitialState,
  matZip: matZipInitialState,
  matMap: matMapInitialState,
};

export default rootReducer;
