import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {User} from '../../types/store';

export const initialState: User = {
  id: '',
  name: '',
  username: '',
  profile: '',
  email: '',
  address: '',
  deviceToken: '',
  pushAllowStatus: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    createUserAction: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      state.id = newUser.id;
      state.name = newUser.name;
      state.profile = newUser.profile;
      state.username = newUser.username;
      state.email = newUser.email;
      state.address = newUser.address;
      state.deviceToken = newUser.deviceToken;
      state.pushAllowStatus = newUser.pushAllowStatus;
      return state;
    },
    updateUserIdAction: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
      return state;
    },
    updateUsernameAction: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      return state;
    },
    updateProfileAction: (state, action: PayloadAction<string>) => {
      state.profile = action.payload;
      return state;
    },
    updateEmailAction: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      return state;
    },
  },
});

export const {
  createUserAction,
  updateUserIdAction,
  updateUsernameAction,
  updateEmailAction,
  updateProfileAction,
} = userSlice.actions;
export default userSlice.reducer;
