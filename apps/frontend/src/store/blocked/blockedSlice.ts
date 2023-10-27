import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PlayerService } from "../../services/player.service";
import { IUserUsername } from "../../types/types";

const fetchBlocked = createAsyncThunk('post/fetchBlocked', async(payload: number) => {
    const blocked = await PlayerService.getAllBlocked(payload);
    return blocked;
})

interface BlockedState {
    blocked: IUserUsername[];
    status: string;
}

const initialState: BlockedState = {
    blocked: [],
    status: 'idle',
}

const blockedSlice = createSlice({
    name: 'blocked',
    initialState,
    reducers: {
        addBlocked: (state, action) => {
            console.log('redux action executed');
            state.blocked.push(action.payload);
        },
        removeBlocked: (state, action: PayloadAction<IUserUsername>) => {
            const blockToRemove = action.payload;
            state.blocked = state.blocked.filter((block) => block.username !== blockToRemove.username);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBlocked.fulfilled, (state, action) => {
            state.blocked = action.payload;
            state.status = 'fulfilled'
        })
        builder.addCase(fetchBlocked.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchBlocked.rejected, (state) => {
            state.status = 'rejected'
        })
    },
});

export const { addBlocked, removeBlocked } = blockedSlice.actions;
export { fetchBlocked };
export default blockedSlice.reducer;