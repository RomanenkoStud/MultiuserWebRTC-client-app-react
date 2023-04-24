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
import RequestStatus from "../components/RequestStatus";

function PreviewView({settings, onSettings, onStart, user}) {
const [message, setMessage] = useState({message: "", successfull: false, loading: false});
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
    onStart(setMessage);
}

const renderCamera = () => {
    if(settings.blur && settings.cam) {
        return (
        <CameraBlurBackground 
            stream={stream} 
            setStream={setCameraStream}
            useMic={settings.mic}
            useCam={settings.cam}
            user={user}
        />
        );
    } else {
        return (
        <Camera
            stream={stream} 
            setStream={setCameraStream}
            useMic={settings.mic}
            useCam={settings.cam}
            user={user}
            latestStreamValue={latestStreamValue}
            latestStreamPromise={latestStreamPromise}
        />
        );
    }
}

const handleChange = (event) => {
    const { name, checked } = event.target;
    onSettings(name, checked);
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
        {message.message ? (
            <RequestStatus message={message}/>
        ) : (
            <Button
                onClick={handleStartCall}
                variant="contained"
                sx={{ mb: 2 }}
            >
                Start call
            </Button>
        )}
    </Box>
    </Container>
);
}

export default PreviewView;