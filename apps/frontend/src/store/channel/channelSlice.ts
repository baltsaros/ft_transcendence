import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../api/axios.api";
import { IUser, IChannel } from "../../types/types";

/* Reducers define how actions change state variables
** One reducer per slice
** An action is a function that returns an object, it is an event
** Flow: dispatch an action to a reducer, reducer checks what to do, store gets updated */

const fetchChannel = createAsyncThunk('get/fetchChannel', async() => {
  const channel = await instance.get('channel/');
  return channel.data
})

interface ChannelState {
  channel: IChannel[];
  status: string;
}

const initialState: ChannelState = {
  channel: [],
  status: 'idle',
}

const channelSlice = createSlice({
  name:'channel',
  initialState,
  reducers: {
    addNewUser: (state, action) => {
      const { channelId, user } = action.payload;
      console.log('channelId', channelId);
      console.log('user', user);
      state.channel = state.channel.map((channel) => {
        if (channel.id === channelId) {
          console.log('match on:', channel.id);
          return {
            ...channel, // clone the channel obj
            users: [...channel.users, user], // copy user in the channel.users array
          }
        }
        return channel;
      })
      console.log(state.channel);
    },
    removeUser: (state, action) => {
      const { channelId, username } = action.payload;
      state.channel = state.channel.map((channel) => {
        if (channel.id === channelId) {
          return {
            ...channel,
            users: channel.users.filter((u) => u.username !== username),
          }
        }
        return channel;
      })
    },
    addChannel: (state, action) => {
        // return [...state, ...action.payload];
        state.channel.push(action.payload);
      }
    },
    extraReducers: (builder) => {
      builder.addCase(fetchChannel.fulfilled, (state, action) => {
        state.channel = action.payload;
      })
      builder.addCase(fetchChannel.pending, (state) => {
        state.status = 'loading'
      })
      builder.addCase(fetchChannel.rejected, (state) => {
        state.status = 'rejected'
      })
    },
  });

/* The code doesn't explicitly define actions, it indirectly creates an action named setChannels
** This line exports the setChannels action, allowing you to dispatch it to update the state managed by the "channel" slice. */
export const { addNewUser } = channelSlice.actions;
export const { removeUser} = channelSlice.actions;
export const { addChannel } = channelSlice.actions;
export {fetchChannel};
export default channelSlice.reducer;
