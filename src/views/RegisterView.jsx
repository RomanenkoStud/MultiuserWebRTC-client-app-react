import { useState } from "react";
import { 
    Button, 
    CssBaseline, 
    TextField, 
    Box, 
    Typography, 
    Container, 
} from '@mui/material';
import LinkWithLogoAnimation from "../components/NavBar/LinkWithLogoAnimation";
import RequestStatus from "../components/RequestStatus";


export default function RegisterView({handleRegister}) {
    const [user, setUser] = useState({username: "", email: "", password: ""});
    const [error, setError] = useState({username: false, email: false, password: false});
    const [message, setMessage] = useState({message: "", successful: false, loading: false});

    const handleSubmit = (event) => {
        event.preventDefault();
        handleRegister(user, setError, setMessage);
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
            Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                    autoComplete="username"
                    autoFocus
                    onInput={(e) => {
                            const input = e.target.value;
                            setUser({...user, username: input})
                        }
                    }
                    sx={{transform: "translateZ(0)"}}
                />
                <TextField
                    error ={error.email}
                    helperText={error.email ? "Error. Input is not email" : ""}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    type="text"
                    label="Email"
                    name="email"
                    autoFocus
                    onInput={(e) => {
                            const input = e.target.value;
                            setUser({...user, email: input})
                        }
                    }
                    sx={{transform: "translateZ(0)"}}
                />
                <TextField
                    error ={error.password}
                    helperText={error.password ? "Error. Too short password" : ""}
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    type="password"
                    label="Password"
                    name="password"
                    autoComplete="current-password"
                    autoFocus
                    onInput={(e) => {
                            const input = e.target.value;
                            setUser({...user, password: input})
                        }
                    }
                    sx={{transform: "translateZ(0)"}}
                />
                <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Submit
                </Button>
                <RequestStatus message={message} 
                link={
                    <LinkWithLogoAnimation to="/login">
                        Go to Login
                    </LinkWithLogoAnimation>
                }/>
            </Box>
        </Box>
    </Container>
    );
}