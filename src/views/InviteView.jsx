import { useState } from "react";
import { useParams } from "react-router-dom";
import {
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Container,
} from '@mui/material';
import RequestStatus from "../components/RequestStatus";


export default function InviteView({user, handleConnect}) {
    const [username, setUsername] = useState(user ? user.username : "");
    const [error, setError] = useState({username: false});
    const [message, setMessage] = useState({message: "", successful: false, loading: false});
    const params = useParams();
    const room = params.room;

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
            Connect to room #{room}
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