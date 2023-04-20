import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#214e28',
            light: '#286c33',
            dark: '#131312',
            contrastText: '#fcfcfc',
        },
        background: {
            default: "#e4f0e2"
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#214e28',
            light: '#286c33',
            dark: '#131312',
            contrastText: '#fcfcfc',
        },
        background: {
            default: "#131312"
        },
    },
});

function AppTheme({ children }) {
    const theme = useSelector((state) => state.settings.theme);

    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        {children}
        </ThemeProvider>
    );
}

export default AppTheme;