import { createSlice } from "@reduxjs/toolkit";

/* Reducers define how actions change state variables
** One reducer per slice
** An action is a function that returns an object, it is an event
** Flow: dispatch an action to a reducer, reducer checks what to do, store gets updated */
const channelSlice = createSlice({
  name: "channel",
  initialState: [],
  reducers: {
    setChannels: (state, action) => {
      console.log('current state: ', state);
      console.log('next state: ', action.payload);
      
      return action.payload 
    },
  },
});

/* The code doesn't explicitly define actions, it indirectly creates an action named setChannels
** This line exports the setChannels action, allowing you to dispatch it to update the state managed by the "channel" slice. */
export const { setChannels } = channelSlice.actions;
export default channelSlice.reducer;
