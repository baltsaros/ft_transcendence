import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import channelReducer from "./channel/channelSlice";
import invitationReducer from "./user/invitationSlice";
import friendReducer from "./user/friendsSlice";
import allUserReducer from "./user/allUsersSlice";
import blockedReducer from "./blocked/blockedSlice"
import adminReducer from "./channel/adminSlice";
import mutedReducer from "./channel/mutedSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    channel: channelReducer,
    invitation: invitationReducer,
    friend: friendReducer,
    allUser: allUserReducer,
    blocked: blockedReducer,
    admin: adminReducer,
    muted: mutedReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
