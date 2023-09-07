import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IUser } from "../../types/types";

// Define a type for the slice state
interface UserState {
  user: IUser | null;
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
    login: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuth = true;
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
    }
  },
});

export const { login, logout, setAvatar, setUsername } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.user;

export default userSlice.reducer;
