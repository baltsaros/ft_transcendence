import { createSlice } from "@reduxjs/toolkit";

/* Reducers define how actions change state variables
** One reducer per slice
** An action is a function that returns an object, it is an event
** Flow: dispatch an action to a reducer, reducer checks what to do, store gets updated */
const channelSlice = createSlice({
  name: "channel",
  initialState: [] as any, // temporary, should be refined
  reducers: {
    setChannel: (state, action) => {
      console.log('current state:', state);
      console.log('next state:', action.payload);
      // state = action.payload;
      state.push(...action.payload);
    },
    addChannel: (state, action) => {
      // console.log('current state:', state);
      // console.log('next state:', action.payload);
      return [...state, action.payload];
    }
  },
});

/* The code doesn't explicitly define actions, it indirectly creates an action named setChannels
** This line exports the setChannels action, allowing you to dispatch it to update the state managed by the "channel" slice. */
export const { setChannel } = channelSlice.actions;
export const { addChannel } = channelSlice.actions;
export default channelSlice.reducer;
