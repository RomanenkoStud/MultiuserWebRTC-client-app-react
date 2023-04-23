import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        },
        update: (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload,
            };
        },
    },
});

export const { login, logout, update } = authSlice.actions;
export default authSlice.reducer;