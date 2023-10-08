import { createSlice } from "@reduxjs/toolkit";
import { IChannel } from "../../types/types";

/* Reducers define how actions change state variables
** One reducer per slice
** An action is a function that returns an object, it is an event
** Flow: dispatch an action to a reducer, reducer checks what to do, store gets updated */

// const initialState: IChannel[] = [];

interface Channel {
  id: number;
  name: string;
}

interface ChannelState {
  channel: Channel[];
}

const initialState: ChannelState = {
  channel: [],
}

const channelSlice = createSlice({
  name:'channel',
  // initialState: [] as IChannel[], // temporary, should be refined to channel w. only username and channelId same for the action parameter
  initialState,
  reducers: {
    setChannel: (state, action) => {
      // console.log('setChannel current state:', state);
      // console.log('setChanel next state:', action.payload);
      // state = action.payload;
      // return [...state, action.payload];
      // return action.payload;
      state.channel = action.payload; 
    },
    addChannel: (state, action) => {
      // console.log('next state:', action.payload);
      console.log('addChannel current state:', state);
      console.log('addChanel next state:', action.payload);
      // state.push(...action.payload);
      // return [...state, ...action.payload];
      state.channel.push(action.payload);
    }
  },
});

/* The code doesn't explicitly define actions, it indirectly creates an action named setChannels
** This line exports the setChannels action, allowing you to dispatch it to update the state managed by the "channel" slice. */
export const { setChannel } = channelSlice.actions;
export const { addChannel } = channelSlice.actions;
export default channelSlice.reducer;
