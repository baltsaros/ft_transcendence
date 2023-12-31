import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { instance } from "../../api/axios.api";
import { IChannel, IResponseUser } from "../../types/types";

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
      state.channel = state.channel.map((channel) => {
        if (channel.id === channelId) {
          return {
            ...channel, // clone the channel obj
            users: [...channel.users, user], // copy user in the channel.users array
          }
        }
        return channel;
      })
    },
    removeUser: (state, action) => {
      const { channelId, username } = action.payload;
      state.channel = state.channel.map((channel) => {
        if (channel.id === channelId) {
          return {
            ...channel,
            users: channel.users.filter((u) => {
              return u.username !== username}),
            }
          }
          return channel;
        })
    },
    removeOwner: (state, action) => {
      const { channelId, username, newOwner} = action.payload;
      state.channel = state.channel.map((channel) => {
        if (channel.id === channelId) {
          return {
            ...channel,
            users: channel.users.filter((u) => {
              return u.username !== username}),
            owner: newOwner
            }
          }
          return channel;
        })
    },
    addBanned: (state, action) => {
      console.log('redux payload', action.payload);
      const channelId = action.payload.channelId;
      const user = action.payload.user;
        state.channel = state.channel.map((channel: IChannel) => {
          if (channel.id === channelId) {
            return {
              ...channel, // clone the channel obj
              banned: [...channel.banned, action.payload.banned], // copy user in the channel.users array
            }
          }
          return channel;
        })
      },
    addChannel: (state, action) => {
      state.channel.push(action.payload);
    },
    updateChannelPassword: (state, action) => {
      console.log('redux payload', action.payload);
      const { channelId, password, mode } = action.payload;
      state.channel = state.channel.map((channel) => {
        if (channel.id === channelId) {
          console.log('match on channel');
          return {
            ...channel,
            mode: mode,
            password: password,
          }
        }
        return channel;
      })
    },
    updateStatutChannel: (state, action:PayloadAction<IResponseUser>) => {
      const userToModify = action.payload;
            state.channel = state.channel.map((elem) => {
              elem.users = elem.users.map((user) => {
                if (user.id === userToModify.id) {
                    return {
                        ...user,
                        status: userToModify.status
                    }
                }
                return user;
              })
              return elem;
            })
    },
    addMessage: (state, action) => {
      console.log('redux payload:', action.payload);;
      const message = action.payload;
      state.channel = state.channel.map((channel) => {
        if (channel.id === message.channelId) {
          return {
            ...channel, // clone the channel obj
            messages: [...channel.messages, message], // copy user in the channel.users array
          }
        }
        return channel;
      })
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
export const { addNewUser, removeUser, removeOwner, addChannel, updateStatutChannel, addMessage, updateChannelPassword, addBanned } = channelSlice.actions;
export {fetchChannel};
export default channelSlice.reducer;
