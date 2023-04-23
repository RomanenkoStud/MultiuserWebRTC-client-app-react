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
import ImageModal from "../components/ImageModal";
import DeleteDialog from "../components/DeleteDialog";
import RequestStatus from "../components/RequestStatus";

const ProfileView = ({user, handleUpdate, handleDelete}) => {
    const [userUpdated, setUserUpdated] = useState({
        username: user.username,  
        email: user.email, 
        password: "", 
        imageUrl: user.imageUrl,
        confirmPassword: ""
    });
    const [error, setError] = useState({username: false, email: false, password: false, confirmPassword: false});
    const [message, setMessage] = useState({message: "", successful: false, loading: false});
    const [status, setStatus] = useState('Online');
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleUsernameChange = (e) => {
        setUserUpdated({...userUpdated, username: e.target.value});
    };

    const handleEmailChange = (e) => {
        setUserUpdated({...userUpdated, email: e.target.value});
    };

    const handlePasswordChange = (e) => {
        setUserUpdated({...userUpdated, password: e.target.value});
    };

    const handleConfirmPasswordChange = (e) => {
        setUserUpdated({...userUpdated, confirmPassword: e.target.value});
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const getUsernameInitials = (name) => {
        const initials = name.match(/\b\w/g) || [];
        return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    };

    const handleImage = (url) => {
        setUserUpdated({...userUpdated, imageUrl: url});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate(userUpdated, setError, setMessage);
    };

    return (
        <Container maxWidth="sm">
        <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 2 }}>
                <Avatar
                    sx={{ width: 100, height: 100, position: 'relative', overflow: 'hidden' }}
                    image={userUpdated.imageUrl}
                >
                    {userUpdated.imageUrl ? (
                        <img src={userUpdated.imageUrl} alt="Profile"
                        style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                        }}/>
                    ) : (
                        <>{getUsernameInitials(userUpdated.username)}</>
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
                                <IconButton component="span" onClick={()=>setOpenImageDialog(true)}>
                                <EditIcon sx={{ fontSize: 14 }}/>
                                </IconButton>
                        </Tooltip>
                    </Box>
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                    Profile
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 2 }}>
                    <TextField
                        error ={error.username}
                        helperText={error.username ? "Error. Too short username" : ""}
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        value={userUpdated.username}
                        onChange={handleUsernameChange}
                    />
                    <TextField
                        error ={error.email}
                        helperText={error.email ? "Error. Input is not email" : ""}
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        value={userUpdated.email}
                        onChange={handleEmailChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="status"
                        label="Status"
                        name="status"
                        value={status}
                        onChange={handleStatusChange}
                    />
                    <TextField
                        error ={error.password}
                        helperText={error.password ? "Error. Too short password" : ""}
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={userUpdated.password}
                        onChange={handlePasswordChange}
                    />
                    <TextField
                        error ={error.confirmPassword}
                        helperText={error.confirmPassword ? "Error. Input value different from set password" : ""}
                        margin="normal"
                        required
                        fullWidth
                        name="confirm-password"
                        label="Confirm new password"
                        type="password"
                        id="confirm-password"
                        value={userUpdated.confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Save changes
                    </Button>
                    <RequestStatus message={message} displayTime={1500}/>
                </Box>
                <Button color="error" fullWidth variant="outlined" sx={{ mb: 2 }} 
                    onClick={() => setOpenDeleteDialog(true)}
                >
                    Delete profile
                </Button>
            </Box>
            <ImageModal 
                open={openImageDialog} 
                handleClose={()=>setOpenImageDialog(false)} 
                setImage={handleImage}
            />
            <DeleteDialog 
                open={openDeleteDialog} 
                handleClose={()=>setOpenDeleteDialog(false)} 
                handleDelete={handleDelete}
            />
        </Container>
    );
};

export default ProfileView;