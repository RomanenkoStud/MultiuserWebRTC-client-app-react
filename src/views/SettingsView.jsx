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

export default function SettingsView({settings, handleConfig}) {

    const handleConfigChange = (event) => {
        const { name, checked } = event.target;
        handleConfig(name, checked);
    };

    return (
        <Container maxWidth="sm">
            <CssBaseline />
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Settings
                </Typography>
                <Divider />
                <Divider />
                <Box mt={2}>
                    <Typography variant="h6" component="h2">
                        Camera configuration
                    </Typography>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    data-testid="mic-switch"
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
                                    data-testid="cam-switch"
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
                                    data-testid="blur-switch"
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