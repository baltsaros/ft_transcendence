import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlayerService } from "../../services/player.service";
import { IUser, IUserUsername } from "../../types/types";
import { ChannelService } from "../../services/channels.service";

const fetchMuted = createAsyncThunk('post/fetchAdmin', async(payload: number) => {
    const muted = await ChannelService.getAllMutedUsersOfChannel(payload);
    return muted;
})

interface MutedState {
    users: IUser[];
    status: string;
}

const initialState: MutedState = {
    users: [],
    status: 'idle',
}

const mutedSlice = createSlice({
    name: 'muted',
    initialState,
    reducers: {
        addMuted: (state, action) => {
            state.users.push(action.payload);
        },
        removeMuted: (state, action: PayloadAction<IUser>) => {
            const adminToRemove = action.payload;
            state.users = state.users.filter((user) => user.id !== adminToRemove.id);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMuted.fulfilled, (state, action) => {
            state.users = action.payload;
            state.status = 'fulfilled'
        })
        builder.addCase(fetchMuted.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchMuted.rejected, (state) => {
            state.status = 'rejected'
        })
    },
});

export const { addMuted, removeMuted } = mutedSlice.actions;
export { fetchMuted };
export default mutedSlice.reducer;