import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlayerService } from "../../services/player.service";
import { IUser, IUserUsername } from "../../types/types";
import { ChannelService } from "../../services/channels.service";

const fetchAdmin = createAsyncThunk('post/fetchAdmin', async(payload: number) => {
    const admins = await ChannelService.getAllAdminsOfChannel(payload);
    return admins;
})

interface AdminState {
    users: IUser[];
    status: string;
}

const initialState: AdminState = {
    users: [],
    status: 'idle',
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        addAdmin: (state, action) => {
            state.users.push(action.payload);
        },
        removeAdmin: (state, action: PayloadAction<IUser>) => {
            const adminToRemove = action.payload;
            state.users = state.users.filter((user) => user.id !== adminToRemove.id);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAdmin.fulfilled, (state, action) => {
            state.users = action.payload;
            state.status = 'fulfilled'
        })
        builder.addCase(fetchAdmin.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchAdmin.rejected, (state) => {
            state.status = 'rejected'
        })
    },
});

export const { addAdmin, removeAdmin } = adminSlice.actions;
export { fetchAdmin };
export default adminSlice.reducer;