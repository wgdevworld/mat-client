import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {User} from '../../types/store';

export const initialState: User = {
  id: '',
  name: '',
  username: '',
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
      // Assuming the payload contains the user information to create
      const newUser = action.payload;
      state.id = newUser.id;
      state.name = newUser.name;
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
  },
});

export const {createUserAction, updateUserIdAction} = userSlice.actions;
export default userSlice.reducer;
