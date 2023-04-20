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
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [message, setMessage] = useState({message: "", successful: false, loading: false});

    const handleSubmit = (event) => {
    event.preventDefault();
    handleRegister(
        username, setUsernameError, 
        email, setEmailError, 
        password, setPasswordError,
        setMessage);
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
                    error ={usernameError}
                    helperText={usernameError ? "Error. Too short username" : ""}
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
                            setUsername(input)
                        }
                    }
                    sx={{transform: "translateZ(0)"}}
                />
                <TextField
                    error ={emailError}
                    helperText={emailError ? "Error. Input is not email" : ""}
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
                            setEmail(input)
                        }
                    }
                    sx={{transform: "translateZ(0)"}}
                />
                <TextField
                    error ={passwordError}
                    helperText={passwordError ? "Error. Too short password" : ""}
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
                            setPassword(input)
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