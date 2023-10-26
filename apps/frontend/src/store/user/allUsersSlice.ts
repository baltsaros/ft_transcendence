import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { instance } from "../../api/axios.api";
import { IResponseUser } from "../../types/types";

/* Reducers define how actions change state variables
** One reducer per slice
** An action is a function that returns an object, it is an event
** Flow: dispatch an action to a reducer, reducer checks what to do, store gets updated */

const fetchAllUsers = createAsyncThunk('get/fetchAllUsers', async() => {
  const allUsers = await instance.get('user/');
  return allUsers.data
})

interface AllUsersState {
  users: IResponseUser[];
  status: string;
}

const initialState: AllUsersState = {
  users: [],
  status: 'idle',
}

const allUsersSlice = createSlice({
    name:'users',
    initialState,
    reducers: {
        addNewUser: (state, action: PayloadAction<IResponseUser>) => {
            const user = action.payload;
            state.users.push(user);
        },
        removeUser: (state, action: PayloadAction<IResponseUser>) => {
            const userToDelete = action.payload;
            state.users = state.users.filter((user) => user.id !== userToDelete.id);
        },
        updateStatus: (state, action: PayloadAction<IResponseUser>) => {
            const userToModify = action.payload;
            state.users = state.users.map((user) => {
                if (user.id === userToModify.id) {
                    return {
                        ...user,
                        status: userToModify.status
                    }
                }
                return user;
            })
        },
        updateUsername: (state, action: PayloadAction<IResponseUser>) => {
            const userToModify = action.payload;
            const tempState = state;
            tempState.users.map((user) => {
                if (user.id === userToModify.id) {
                    user.username = userToModify.username;
                }
            })
            state = tempState;
        },
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
            state.users = action.payload;
        })
        builder.addCase(fetchAllUsers.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchAllUsers.rejected, (state) => {
            state.status = 'rejected'
        })
    },
});

/* The code doesn't explicitly define actions, it indirectly creates an action named setChannels
** This line exports the setChannels action, allowing you to dispatch it to update the state managed by the "channel" slice. */
export const { addNewUser, removeUser, updateStatus, updateUsername } = allUsersSlice.actions;
export {fetchAllUsers};
export default allUsersSlice.reducer;
