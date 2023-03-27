import { useState } from "react";
import { useParams } from "react-router-dom";
import LinkWithLogoAnimation from "../components/NavBar/LinkWithLogoAnimation";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function InviteScreen() {
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const params = useParams();
    const room = params.room;

    const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
        user: data.get('user'),
        room: data.get('room'),
    });
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
                    onInput={(e) => {
                            setUsername(e.target.value)
                            setUsernameError(username.length >= 8 ? false : true)
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