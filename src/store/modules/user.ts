import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {MatMap, User} from '../../types/store';

export const initialState: User = {
  id: '',
  name: '',
  username: '',
  email: '',
  institution: '',
  address: '',
  userMaps: [],
  followingMaps: [],
  deviceToken: '',
  pushAllowStatus: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    createUserAction: (state, action: PayloadAction<User>) => {
      // Assuming the payload contains the user information to create
      const newUser = action.payload;
      state.id = newUser.id;
      state.name = newUser.name;
      state.username = newUser.username;
      state.email = newUser.email;
      state.institution = newUser.institution;
      state.address = newUser.address;
      state.followingMaps = newUser.followingMaps;
      state.deviceToken = newUser.deviceToken;
      state.pushAllowStatus = newUser.pushAllowStatus;
      return state;
    },
    createMatMapAction: (state, action: PayloadAction<MatMap>) => {
      state = {...state, userMaps: [...state.userMaps, action.payload]};
      return state;
    },
  },
});

export const {createUserAction} = userSlice.actions;
export default userSlice.reducer;
