import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLoggedIn: false,
};


const userSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        addUser: (state, action) => {
            console.log(action.payload);
            
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        }
    }

});

export const { addUser, logout } = userSlice.actions;
export default userSlice.reducer