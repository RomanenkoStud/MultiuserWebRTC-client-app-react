import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme } from '../store/slices/settingsSlice';

const StyledSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-thumb": {
        backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#bcc3c5",
    },
    "& .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
    "& .MuiSwitch-root": {
        backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#bdbdbd",
    },
}));

export default function ThemeSwitch() {
    const theme = useSelector((state) => state.settings.theme);
    const dispatch = useDispatch();
    const handleThemeChange = (event) => {
        dispatch(changeTheme(event.target.checked ? 'dark' : 'light'));
    };
    return (
        <StyledSwitch
            checked={theme === 'dark'}
            onChange={handleThemeChange}
            name="theme"
            color="default"
        />
    );
}