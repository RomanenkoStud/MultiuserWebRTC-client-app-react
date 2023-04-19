import { useState } from 'react';
import {
    CssBaseline,
    Button,
    Container,
    TextField,
    Typography,
    Box,
    Avatar,
    IconButton,
    Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';


const ProfileView = ({user}) => {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('Online');
    const [image, setImage] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleImageChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const getUsernameInitials = (name) => {
        const initials = name.match(/\b\w/g) || [];
        return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    };

    return (
        <Container maxWidth="sm">
        <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <Avatar
                sx={{ width: 100, height: 100, position: 'relative', overflow: 'hidden' }}
                >
                    {image ? (
                        <img src={image} alt="Profile"
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                        }}/>
                    ) : (
                        <>{getUsernameInitials(username)}</>
                    )}
                    <Box
                        sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'background.default',
                        borderRadius: '50%',
                        boxShadow: (theme) => theme.shadows[1],
                        '&:hover': {
                            bgcolor: 'background.paper',
                        },
                        }}
                    >
                        <Tooltip title="Change profile picture">
                            <label htmlFor="upload-image">
                                <IconButton component="span">
                                <EditIcon sx={{ fontSize: 14 }}/>
                                </IconButton>
                            </label>
                            </Tooltip>
                            <input
                            id="upload-image"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                            />
                    </Box>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                    Profile
                </Typography>
                <Box component="form" sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={username}
                        InputProps={{ readOnly: true }}
                        onChange={handleUsernameChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        InputProps={{ readOnly: true }}
                        onChange={handleEmailChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="status"
                        label="Status"
                        name="status"
                        autoComplete="status"
                        value={status}
                        onChange={handleStatusChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirm-password"
                        label="Confirm new password"
                        type="password"
                        id="confirm-password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Save changes
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ProfileView;