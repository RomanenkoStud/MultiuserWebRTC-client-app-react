import { useState } from "react";
import {
    Button, 
    CssBaseline, 
    TextField, 
    Box, 
    Typography, 
    Container,
} from '@mui/material';
import RequestStatus from "../components/RequestStatus";


export default function ConnectView({user, handleConnect}) {
    const [roomname, setRoom] = useState("");
    const [username, setUsername] = useState(user ? user.username : "");
    const [error, setError] = useState({username: false, room: false});
    const [message, setMessage] = useState({message: "", successfull: false, loading: false});

    const handleSubmit = (event) => {
        event.preventDefault();
        handleConnect(username, roomname, setError, setMessage);
    };

    return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
            Connect to room
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    error ={error.username}
                    helperText={error.username ? "Error. Too short username" : ""}
                    margin="normal"
                    required
                    fullWidth
                    id="user"
                    type="text"
                    label="User"
                    name="user"
                    autoFocus
                    value={username}
                    InputProps={{ readOnly: user ? true : false }}
                    onInput={(e) => {
                            setUsername(e.target.value)
                        }
                    }
                />
                <TextField
                    error ={error.room}
                    helperText={error.room ? "Error. Too short room name" : ""}
                    margin="normal"
                    required
                    fullWidth
                    name="room"
                    label="Room"
                    type="text"
                    id="room"
                    value={roomname}
                    onInput={(e) => {
                            setRoom(e.target.value)
                        }
                    }
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Connect
                </Button>
                <RequestStatus message={message}/>
            </Box>
        </Box>
    </Container>
    );
}