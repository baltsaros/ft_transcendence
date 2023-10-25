import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {  IUserUsername } from "../../types/types";
import { PlayerService } from "../../services/player.service";

/* Reducers define how actions change state variables
** One reducer per slice
** An action is a function that returns an object, it is an event
** Flow: dispatch an action to a reducer, reducer checks what to do, store gets updated */

const fetchFriends = createAsyncThunk('get/fetchFriends', async(username: string) => {
    const idUser = await PlayerService.getInfoUser(username);
    const friends = await PlayerService.getAllFriends(idUser);
    return friends;
})

interface FriendState {
  friends: IUserUsername[];
  status: string;
}

const initialState: FriendState = {
  friends: [],
  status: 'idle',
}

const friendsSlice = createSlice({
    name:'friends',
    initialState,
    reducers: {
        addFriend: (state, action: PayloadAction<IUserUsername>) => {
            state.friends.push(action.payload);
        },
        removeFriend: (state, action: PayloadAction<IUserUsername>) => {
            const friendToRemove = action.payload;
            state.friends = state.friends.filter((friend) => friend.username !== friendToRemove.username);
        },
        updateStatusFriend: (state, action: PayloadAction<IUserUsername>) => {
            const userToModify = action.payload;
            state.friends = state.friends.map((friend) => {
                if (friend.username === userToModify.username) {
                    return {
                        ...friend,
                        status: userToModify.status
                    }
                }
                return friend;
            })
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFriends.fulfilled, (state, action) => {
            state.friends = action.payload;
        })
        builder.addCase(fetchFriends.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchFriends.rejected, (state) => {
            state.status = 'rejected'
        })
    },
});

/* The code doesn't explicitly define actions, it indirectly creates an action named setChannels
** This line exports the setChannels action, allowing you to dispatch it to update the state managed by the "channel" slice. */
export const { addFriend, removeFriend, updateStatusFriend } = friendsSlice.actions;
export {fetchFriends};
export default friendsSlice.reducer;
