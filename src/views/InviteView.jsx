import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLogoAnimation } from "../hooks/useLogoAnimation";
import {
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Container
} from '@mui/material';
import { useSelector } from "react-redux";


export default function InviteView() {
    const user = useSelector((state) => state.auth.user);
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const params = useParams();
    const room = params.room;

    const { navigate } = useLogoAnimation();

    const handleSubmit = (event) => {
        event.preventDefault();
        if(!usernameError) {
            navigate(`/call/${username}/${room}`);
        }
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
                    InputProps={{ readOnly: user }}
                    onInput={(e) => {
                            setUsername(e.target.value)
                            setUsernameError(username.length >= 8 ? false : true)
                        }
                    }
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={usernameError}
                >
                    Connect
                </Button>
            </Box>
        </Box>
    </Container>
    );
}