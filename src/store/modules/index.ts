import {combineReducers} from '@reduxjs/toolkit';
import zipData, {initialState as zipDataInitialState} from './zipData';

const rootReducer = combineReducers({zipData});

export const initialStateObject: {
  [key: string]: any;
} = {zipData: zipDataInitialState};

export default rootReducer;
