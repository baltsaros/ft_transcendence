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
  invitations: IUserUsername[];
  friends: IUserUsername[];
}

// Define the initial state using that type
const initialState: UserState = {
  user: null,
  username: "",
  avatar: "",
  isAuth: false,
  invitations: [],
  friends: [],
};

const fetchInvitation = createAsyncThunk('post/fetchInvitation', async(id) => {
  const invits = await instance.post<IUserUsername[]>('user/getInvitations/', {id});
  return invits.data;
})

const fetchFriends = createAsyncThunk('post/fetchFriends', async(id) => {
  const friends =  await instance.post<IUserUsername[]>("user/getFriends", {id});
  return friends.data;
})

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IResponseUser>) => {
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
    },
    addInvitation: (state, action: PayloadAction<IUserUsername>) => {
      state.invitations.push(action.payload);
    },
    removeInvitation: (state, action: PayloadAction<string>) => {
      state.invitations = state.invitations.filter((user) => user.username !== action.payload);
    },
    addFriend: (state, action: PayloadAction<string>) => {
      const friend = state.invitations.filter((user) => user.username === action.payload);
      state.friends.push(friend[0]);
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.filter((user) => user.username !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvitation.fulfilled, (state, action) => {
      state.invitations = action.payload;
    })
    builder.addCase(fetchFriends.fulfilled, (state, action) => {
      state.friends = action.payload;
    })
  },
});

export const { login, logout, setAvatar, setUsername, addInvitation, removeInvitation, addFriend, removeFriend } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.user;
export {fetchInvitation, fetchFriends};
export default userSlice.reducer;
