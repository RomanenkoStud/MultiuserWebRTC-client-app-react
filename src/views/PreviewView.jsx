import { useEffect, useState, useRef } from "react";
import { 
    CssBaseline, 
    Box, 
    Container, 
    Grid, 
    Button, 
    FormGroup, 
    FormControlLabel, 
    Checkbox,
    TextField
} from '@mui/material';
import { 
    Camera, 
    CameraBlurBackground
}  from "../components/UserMediaInputs/UserMediaInputs";
import RequestStatus from "../components/RequestStatus";

function PreviewView({settings, onSettings, onStart, onJoin, user, room, socket}) {
const [roomPassword, setRoomPassword] = useState({enabled: false, value:""});
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

const handleRoomPasswordChange = (event) => {
    setRoomPassword((prev) => ({ ...prev, value: event.target.value }));
};

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

const handleSubmit = (event) => {
    event.preventDefault();
    setMessage((prev) => ({ ...prev, loading: true }));
    if(roomPassword.enabled) {
        socket.current.emit("join_with_password", { username: user.username, room: room, password: roomPassword.value });
    } else {
        socket.current.emit("join", { username: user.username, room: room });
    }
};

useEffect(() => {
    onStart()
    socket.current.connect();
    socket.current.on('password', () => {
        setRoomPassword((prev) => ({ ...prev, enabled: true }));
        setMessage((prev) => ({ ...prev, loading: false }));
    });
    socket.current.on('joined', () => {
        setMessage((prev) => ({ ...prev, successfull: true, loading: false }));
        onJoin()
    });
    socket.current.on('join_error', (error) => {
        setMessage({ message: error, successfull: false, loading: false });
    });
}, [socket, onStart, onJoin]);

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
            <Grid item xs={12} sm={6} md={3}>
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
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {roomPassword.enabled&&(<TextField
                margin="normal"
                fullWidth
                id="room-password"
                label="Room Password"
                name="room-password"
                autoComplete="off"
                type="password"
                value={roomPassword.value}
                sx={{ mb: 2 }}
                onChange={handleRoomPasswordChange}
            />)}
            <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{ mb: 2 }}
                    disabled={message.loading}
                >
                Connect
            </Button>
            <RequestStatus message={message}/>
            </Box>
    </Box>
    </Container>
);
}

export default PreviewView;