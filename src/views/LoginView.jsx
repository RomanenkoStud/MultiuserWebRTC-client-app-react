import { useState, useEffect } from "react";
import { 
    Button, 
    CssBaseline, 
    TextField, 
    Box, 
    Typography, 
    Container, 
} from '@mui/material';
import RequestStatus from "../components/RequestStatus";
import { useLogoAnimation } from '../hooks/useLogoAnimation';
import { useAuth } from "../hooks/useAuth";


export default function LoginView() {
    const { handleLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [message, setMessage] = useState({message: "", successful: false, loading: false});
    const { navigate } = useLogoAnimation();

    useEffect(() => {
        if(message.successful) {
            setTimeout(() => {
                navigate("/");
            }, 1500); // 3 second delay
        }
    }, [message, navigate])

    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogin(email, password, setEmailError, setPasswordError, setMessage);
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
                        disabled={message.loading}
                    >
                        Submit
                </Button>
                <RequestStatus message={message}/>
            </Box>
        </Box>
    </Container>
    );
}