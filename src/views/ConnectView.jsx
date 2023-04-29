import { useState } from "react";
import {
    Button, 
    CssBaseline, 
    TextField, 
    Box, 
    Typography, 
    Container,
} from '@mui/material';


export default function ConnectView({user, handleConnect}) {
    const [roomId, setRoom] = useState("");
    const [username, setUsername] = useState(user ? user.username : "");
    const [error, setError] = useState({username: false});

    const handleSubmit = (event) => {
        event.preventDefault();
        handleConnect(username, roomId, setError);
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
                    margin="normal"
                    required
                    fullWidth
                    name="room"
                    label="Room"
                    type="text"
                    id="room"
                    value={roomId}
                    onKeyPress={(e) => {
                        const keyValue = e.key;
                        if (!/^[0-9]*$/i.test(keyValue)) {
                            e.preventDefault();
                        }
                    }}
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
            </Box>
        </Box>
    </Container>
    );
}