import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import channelReducer from "./channel/channelSlice";
import invitationReducer from "./user/invitationSlice";
import friendReducer from "./user/friendsSlice";
import allUserReducer from "./user/allUsersSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    channel: channelReducer,
    invitation: invitationReducer,
    friend: friendReducer,
    allUser: allUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
