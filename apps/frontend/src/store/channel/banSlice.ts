import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ChannelService } from "../../services/channels.service";
import { IUser } from "../../types/types";

/* Reducers define how actions change state variables
** One reducer per slice
** An action is a function that returns an object, it is an event
** Flow: dispatch an action to a reducer, reducer checks what to do, store gets updated */

const fetchBanned = createAsyncThunk('get/fetchBanned', async(idChannel: number) => {
    const usersBanned = await ChannelService.getAllBannedUsersOfChannel(idChannel);
    return usersBanned;
})

interface BannedState {
  banned: IUser[];
  status: string;
}

const initialState: BannedState = {
  banned: [],
  status: 'idle',
}

const bannedSlice = createSlice({
    name:'banned',
    initialState,
    reducers: {
        addBanned: (state, action: PayloadAction<IUser>) => {
            state.banned.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBanned.fulfilled, (state, action) => {
            state.banned = action.payload;
        })
        builder.addCase(fetchBanned.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchBanned.rejected, (state) => {
            state.status = 'rejected'
        })
    },
});

/* The code doesn't explicitly define actions, it indirectly creates an action named setChannels
** This line exports the setChannels action, allowing you to dispatch it to update the state managed by the "channel" slice. */
export const { addBanned } = bannedSlice.actions;
export {fetchBanned};
export default bannedSlice.reducer;
