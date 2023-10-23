import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IResponseUser, IUser, IUserUsername } from "../../types/types";
import { instance } from "../../api/axios.api";

// Define a type for the slice state
interface UserState {
  user: IResponseUser | null;
  username: string;
  avatar: string;
  isAuth: boolean;
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  username: "",
  avatar: "",
  isAuth: false,
};

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IResponseUser>) => {
      state.user = action.payload;
      state.isAuth = true;
      console.log('redux', state.user);
    },
    logout: (state) => {
      state.user = null;
      state.username = "";
      state.avatar = "";
      state.isAuth = false;
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    // addInvitation: (state, action: PayloadAction<IUserUsername>) => {
    //   state.user!.invitations.push(action.payload);
    // },
    // removeInvitation: (state, action: PayloadAction<string>) => {
    //   state.user!.invitations = state.user!.invitations.filter((user) => user.username !== action.payload);
    // },
    // addFriend: (state, action: PayloadAction<string>) => {
    //   const friend = state.user!.invitations.filter((user) => user.username === action.payload);
    //   state.user!.friends.push(friend[0]);
    // },
    // removeFriend: (state, action: PayloadAction<string>) => {
    //   state.user!.friends = state.user!.friends.filter((user) => user.username !== action.payload);
    // }
  },
});

export const { login, logout, setAvatar, setUsername } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.user;
export default userSlice.reducer;
