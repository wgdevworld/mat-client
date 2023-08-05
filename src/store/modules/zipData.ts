import assets from '../../../assets';
import {MatZip} from '../../types/store';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const name = 'zipData';

export const initialState: MatZip = {
  id: '',
  name: '맛집',
  stars: 0,
  numReview: 0,
  address: '',
  distance: 0,
  isVisited: false,
  category: '',
};

export const zipSlice = createSlice({
  name,
  initialState,
  reducers: {
    zipAction: (state, action: PayloadAction<MatZip>) => {
      state = {...state, ...action.payload};
      return state;
    },
  },
});

export const {zipAction} = zipSlice.actions;
export default zipSlice.reducer;
