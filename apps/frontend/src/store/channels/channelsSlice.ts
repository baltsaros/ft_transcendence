import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IGetChannels } from "../../types/types";

// difference between standard and slice approach ?
const channelSlice = createSlice({
  name: "channels",
  initialState: [],
  reducers: {
    setChannels: (state, action) => {
      return action.payload 
    },
  },
});

export const { setChannels } = channelSlice.actions;
export default channelSlice.reducer;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.user;

