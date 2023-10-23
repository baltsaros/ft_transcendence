import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import channelReducer from "./channel/channelSlice"
import blockedReducer from "./blocked/blockedSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    channel: channelReducer,
    blocked: blockedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
