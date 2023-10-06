import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import channelReducer from "./channel/channelSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    channel: channelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
