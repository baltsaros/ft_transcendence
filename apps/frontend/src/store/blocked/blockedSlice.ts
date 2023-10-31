import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {  IUserUsername } from "../../types/types";
import { PlayerService } from "../../services/player.service";

/* Reducers define how actions change state variables
** One reducer per slice
** An action is a function that returns an object, it is an event
** Flow: dispatch an action to a reducer, reducer checks what to do, store gets updated */

const fetchBlocked = createAsyncThunk('get/fetchBlocked', async(id: number) => {
    const blocked = await PlayerService.getAllBlocked(id);
    return blocked;
})

interface BlockState {
  users: IUserUsername[];
  status: string;
}

const initialState: BlockState = {
  users: [],
  status: 'idle',
}

const blockedSlice = createSlice({
    name:'blocked',
    initialState,
    reducers: {
        addBlocked: (state, action: PayloadAction<IUserUsername>) => {
            state.users.push(action.payload);
        },
        removeBlocked: (state, action: PayloadAction<IUserUsername>) => {
            const userToRemove = action.payload;
            state.users = state.users.filter((user) => user.username !== userToRemove.username);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBlocked.fulfilled, (state, action) => {
            state.users = action.payload;
        })
        builder.addCase(fetchBlocked.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchBlocked.rejected, (state) => {
            state.status = 'rejected'
        })
    },
});

/* The code doesn't explicitly define actions, it indirectly creates an action named setChannels
** This line exports the setChannels action, allowing you to dispatch it to update the state managed by the "channel" slice. */
export const { addBlocked, removeBlocked } = blockedSlice.actions;
export {fetchBlocked};
export default blockedSlice.reducer;
