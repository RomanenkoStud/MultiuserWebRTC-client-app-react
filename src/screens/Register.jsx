import { useState } from "react";
import { 
    Button, 
    CssBaseline, 
    TextField, 
    Box, 
    Typography, 
    Container, 
    Alert 
} from '@mui/material';
import isEmail from 'validator/lib/isEmail';
import LinkWithLogoAnimation from "../components/NavBar/LinkWithLogoAnimation";
import RequestStatus from "../components/RequestStatus";
import userService from "../services/user.service";

export default function Register() {
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [message, setMessage] = useState({message: "", successful: false, loading: false});

    const handleSubmit = (event) => {
    event.preventDefault();
    const validateUsername = username.length >= 8 ? false : true;
    const validateEmail = !isEmail(email);
    const validatePassword = password.length >= 8 ? false : true;
    setUsernameError(validateUsername);
    setEmailError(validateEmail);
    setPasswordError(validatePassword);
    if (!validateUsername && !validateEmail && !validatePassword) {
        setMessage({
            successful: false,
            message: "Please wait...",
            loading: true
        });
        userService
            .register(username, email, password)
            .then(
                (response) => {
                    setMessage({
                        message: "Thanks for registration " + username + "!",
                        successful: true,
                        loading: false
                    });
                },
                (error) => {
                    setMessage({
                        successful: false,
                        message: error.response.data,
                        loading: false
                    });
                }
            );
    };
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
                />
                <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Submit
                </Button>
                <RequestStatus message={message}/>
            </Box>
        </Box>
    </Container>
    );
}