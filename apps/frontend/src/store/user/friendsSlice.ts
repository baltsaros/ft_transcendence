import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { instance } from "../../api/axios.api";
import { IUserRelation } from "../../types/types";

/* Reducers define how actions change state variables
** One reducer per slice
** An action is a function that returns an object, it is an event
** Flow: dispatch an action to a reducer, reducer checks what to do, store gets updated */

const fetchFriends = createAsyncThunk('get/fetchFriends', async(relation: IUserRelation) => {
  const friends = await instance.post('user/getFriend/', relation.receiverId);
  return friends.data;
})

interface FriendState {
  friends: IUserRelation[];
  status: string;
}

const initialState: FriendState = {
  friends: [],
  status: 'idle',
}

const invitationSlice = createSlice({
    name:'invitations',
    initialState,
    reducers: {
        addFriend: (state, action: PayloadAction<IUserRelation>) => {
            // return [...state, ...action.payload];
            state.friends.push(action.payload);
        },
        removeFriend: (state, action: PayloadAction<IUserRelation>) => {
            const friendToRemove = action.payload;
            state.friends = state.friends.filter((friend) => friend.receiverId != friendToRemove.receiverId
                && friend.senderId !== friendToRemove.senderId);
        }
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
export const { addFriend, removeFriend } = invitationSlice.actions;
export {fetchFriends};
export default invitationSlice.reducer;
