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
import { useParams } from "react-router-dom";


export default function ConnectView({user, handleConnect}) {
    const params = useParams();
    const [room, setRoom] = useState(params.room ? params.room : "");
    const [username, setUsername] = useState(user ? user.username : "");
    const [error, setError] = useState({username: false, room: false});
    const [message, setMessage] = useState({message: "", successful: false, loading: false});

    const handleSubmit = (event) => {
        event.preventDefault();
        handleConnect(username, room, setError, setMessage);
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
                    InputProps={{ readOnly: user }}
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
                    value={room}
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