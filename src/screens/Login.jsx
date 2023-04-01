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
import { useLogoAnimation } from '../hooks/useLogoAnimation';
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";

import authService from "../services/auth.service";

export default function Login() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [message, setMessage] = useState({message: "", successful: false});
    const { navigate } = useLogoAnimation();

    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        const validateEmail = !isEmail(email);
        const validatePassword = password.length >= 8 ? false : true;
        setEmailError(validateEmail);
        setPasswordError(validatePassword);
        if (!validateEmail && !validatePassword) {
            authService
                .login(email, password)
                .then(
                    (response) => {
                        setMessage({
                            message: "Wellcome " + response.username + "!",
                            successful: true,
                        });
                        dispatch(login(response));
                        setTimeout(() => {
                            navigate("/");
                        }, 1500); // 3 second delay
                    },
                    (error) => {
                        setMessage({
                            successful: false,
                            message: error.response.data,
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
            Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                    autoComplete="email"
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
                {message.message && (
                    <Alert severity={message.successful ? 'success' : 'error'}>
                    {message.message + " "}
                    </Alert>
                )}
            </Box>
        </Box>
    </Container>
    );
}