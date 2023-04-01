import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: 'light',
    config: {
        mic: false,
        cam: false,
        blur: false,
    },
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        changeTheme: (state, action) => {
            state.theme = action.payload;
        },
        changeConfig: (state, action) => {
            state.config = {
                ...state.config,
                ...action.payload,
            };
        },
    },
});

export const { changeTheme, changeConfig } = settingsSlice.actions;
export default settingsSlice.reducer;