import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { instance } from "../../api/axios.api";
import { IUserRelation, IUserUsername } from "../../types/types";
import { PlayerService } from "../../services/player.service";

/* Reducers define how actions change state variables
** One reducer per slice
** An action is a function that returns an object, it is an event
** Flow: dispatch an action to a reducer, reducer checks what to do, store gets updated */

const fetchInvitations = createAsyncThunk('get/fetchInvitations', async(username: string) => {
    const idUser = PlayerService.getInfoUser(username);
    const invitations = await instance.post('user/getInvitations/', idUser);
    return invitations.data;
})

interface InvitationState {
  invitations: IUserUsername[];
  status: string;
}

const initialState: InvitationState = {
  invitations: [],
  status: 'idle',
}

const invitationSlice = createSlice({
    name:'invitations',
    initialState,
    reducers: {
        addInvitation: (state, action: PayloadAction<IUserUsername>) => {
            state.invitations.push(action.payload);
        },
        removeInvitation: (state, action: PayloadAction<IUserUsername>) => {
            const invitationToRemove = action.payload;
            state.invitations = state.invitations.filter((invit) => invit.username != invitationToRemove.username);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchInvitations.fulfilled, (state, action) => {
            state.invitations = action.payload;
        })
        builder.addCase(fetchInvitations.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchInvitations.rejected, (state) => {
            state.status = 'rejected'
        })
    },
});

/* The code doesn't explicitly define actions, it indirectly creates an action named setChannels
** This line exports the setChannels action, allowing you to dispatch it to update the state managed by the "channel" slice. */
export const { addInvitation, removeInvitation } = invitationSlice.actions;
export {fetchInvitations};
export default invitationSlice.reducer;
