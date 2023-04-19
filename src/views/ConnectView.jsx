import { useState } from "react";
import LinkWithLogoAnimation from "../components/NavBar/LinkWithLogoAnimation";
import {
    Button, 
    CssBaseline, 
    TextField, 
    Box, 
    Typography, 
    Container
} from '@mui/material';

export default function ConnectView({user}) {
    const [room, setRoom] = useState("");
    const [username, setUsername] = useState(user ? user.username : "");
    const [roomError, setRoomError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);

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
            <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                    error ={usernameError}
                    helperText={usernameError ? "Error. Too short username" : ""}
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
                            setUsernameError(username.length >= 8 ? false : true)
                        }
                    }
                />
                <TextField
                    error ={roomError}
                    helperText={roomError ? "Error. Too short room name" : ""}
                    margin="normal"
                    required
                    fullWidth
                    name="room"
                    label="Room"
                    type="text"
                    id="room"
                    onInput={(e) => {
                            setRoom(e.target.value)
                            setRoomError(room.length >= 8 ? false : true )
                        }
                    }
                />
                <LinkWithLogoAnimation to={`/call/${username}/${room}`} style={{ textDecoration: 'none' }}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Connect
                    </Button>
                </LinkWithLogoAnimation>
            </Box>
        </Box>
    </Container>
    );
}