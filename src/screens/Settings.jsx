import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    CssBaseline,
    Box,
    Typography,
    FormControlLabel,
    Switch,
    FormGroup,
    Divider,
} from '@mui/material';
import { changeTheme, changeConfig } from '../store/slices/settingsSlice';

export default function Settings() {
    const settings = useSelector((state) => state.settings);
    const dispatch = useDispatch();

    const handleThemeChange = (event) => {
        dispatch(changeTheme(event.target.checked ? 'dark' : 'light'));
    };

    const handleConfigChange = (event) => {
        const { name, checked } = event.target;
        dispatch(changeConfig({ [name]: checked }));
    };

    return (
        <Container maxWidth="sm">
            <CssBaseline />
        <Box my={4}>
            <Typography variant="h4" component="h1" gutterBottom>
                Settings
            </Typography>
            <Divider />
            <Box mt={2}>
            <Typography variant="h6" component="h2">
                Theme
            </Typography>
            <FormGroup>
                <FormControlLabel
                control={
                    <Switch
                    checked={settings.theme === 'dark'}
                    onChange={handleThemeChange}
                    name="theme"
                    color="primary"
                    />
                }
                label="Dark mode"
                />
            </FormGroup>
            </Box>
            <Divider />
            <Box mt={2}>
            <Typography variant="h6" component="h2">
                Camera configuration
            </Typography>
            <FormGroup>
                <FormControlLabel
                control={
                    <Switch
                    checked={settings.config.mic}
                    onChange={handleConfigChange}
                    name="mic"
                    color="primary"
                    />
                }
                label="Microphone"
                />
                <FormControlLabel
                control={
                    <Switch
                    checked={settings.config.cam}
                    onChange={handleConfigChange}
                    name="cam"
                    color="primary"
                    />
                }
                label="Camera"
                />
                <FormControlLabel
                control={
                    <Switch
                    checked={settings.config.blur}
                    onChange={handleConfigChange}
                    name="blur"
                    color="primary"
                    />
                }
                label="Blur background"
                />
            </FormGroup>
            </Box>
        </Box>
        </Container>
    );
}