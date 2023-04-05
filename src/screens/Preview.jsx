import { useEffect, useState, useRef } from "react";
import { 
    CssBaseline, 
    Box, 
    Container, 
    Grid, 
    Button, 
    FormGroup, 
    FormControlLabel, 
    Checkbox 
} from '@mui/material';
import { 
    Camera, 
    CameraBlurBackground
}  from "../components/UserMediaInputs/UserMediaInputs";

function Preview({settings, setSettings, onStart}) {

const [stream, setStream] = useState(null);
const latestStreamValue = useRef(null);
const latestStreamPromise = useRef(null);

const endStream = (stream) => {
    stream.getTracks().forEach(function(track) {
        track.stop();
    });
}

const setCameraStream = (newStream) => {
    if(stream) {
        endStream(stream);
    }
    setStream(newStream);
}

useEffect(() => {
    return function cleanup() {
        if(stream) {
            endStream(stream);
        }
    };
}, [stream]);


const handleStartCall = () => {
    onStart();
}

const renderCamera = () => {
    if(settings.blur && settings.cam) {
        return (
        <CameraBlurBackground 
            stream={stream} 
            setStream={setCameraStream}
            useMic={settings.mic}
            useCam={settings.cam}
        />
        );
    } else {
        return (
        <Camera
            stream={stream} 
            setStream={setCameraStream}
            useMic={settings.mic}
            useCam={settings.cam}
            latestStreamValue={latestStreamValue}
            latestStreamPromise={latestStreamPromise}
        />
        );
    }
}

const handleChange = (event) => {
    const { name, checked } = event.target;
    setSettings({ ...settings, [name]: checked });
};

return (
    <Container component="main" maxWidth='xl'>
    <CssBaseline />
    <Box
                sx={{
                marginTop: "5%",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
    >
    <Container maxWidth='xl'>
    <Grid container spacing={1} justifyContent="center">
        {/* Main */}
        <Grid item xs={12} sm={6} md={4}>
        {renderCamera()}
        </Grid>
    </Grid>
    
    </Container>
        <FormGroup style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel
            control={<Checkbox checked={settings.cam} onChange={handleChange} name="cam" />}
            label="Camera"
            />
            <FormControlLabel
            control={<Checkbox checked={settings.mic} onChange={handleChange} name="mic" />}
            label="Microphone"
            />
            <FormControlLabel
            control={<Checkbox checked={settings.blur} onChange={handleChange} name="blur" />}
            label="Background Blur"
            />
        </FormGroup>
        <Button
            onClick={handleStartCall}
            variant="contained"
        >
            Start call
        </Button>
    </Box>
    </Container>
);
}

export default Preview;