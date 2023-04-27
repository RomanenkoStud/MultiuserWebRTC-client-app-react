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

function ChangePasswordForm({ handlePasswordUpdate }) {
    const [passwordForm, setPasswordForm] = useState({
        password: "",  
        confirmPassword: "",
    });
    const [error, setError] = useState({password: false, confirmPassword: false});
    const [message, setMessage] = useState({message: "", successful: false, loading: false});

    const handlePasswordChange = (e) => {
        setPasswordForm({...passwordForm, password: e.target.value});
    };

    const handleConfirmPasswordChange = (e) => {
        setPasswordForm({...passwordForm, confirmPassword: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handlePasswordUpdate(passwordForm, setPasswordForm, setError, setMessage);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 2 }}>
            <TextField
            error ={error.password}
            helperText={error.password ? "Error. Too short password" : ""}
            margin="normal"
            fullWidth
            name="password"
            label="New password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={passwordForm.password}
            onChange={handlePasswordChange}
            />
            <TextField
            error ={error.confirmPassword}
            helperText={error.confirmPassword ? "Error. Input value different from set password" : ""}
            margin="normal"
            fullWidth
            name="confirm-password"
            label="Confirm new password"
            type="password"
            id="confirm-password"
            value={passwordForm.confirmPassword}
            onChange={handleConfirmPasswordChange}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Change Password
            </Button>
            <RequestStatus message={message} displayTime={1500}/>
        </Box>
    );
}

const ProfileView = ({user, handleUpdate, handlePasswordUpdate, handleDelete}) => {
    const [userUpdated, setUserUpdated] = useState({
        username: user.username,  
        email: user.email, 
        status: user.status, 
        imageUrl: user.imageUrl,
    });
    const [error, setError] = useState({username: false, email: false});
    const [message, setMessage] = useState({message: "", successful: false, loading: false});
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleUsernameChange = (e) => {
        setUserUpdated({...userUpdated, username: e.target.value});
    };

    const handleEmailChange = (e) => {
        setUserUpdated({...userUpdated, email: e.target.value});
    };
    
    const handleStatusChange = (e) => {
        setUserUpdated({...userUpdated, status: e.target.value});
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
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
                        value={userUpdated.status}
                        onChange={handleStatusChange}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Save changes
                    </Button>
                    <RequestStatus message={message} displayTime={1500}/>
                </Box>
            </Box>
            <ChangePasswordForm handlePasswordUpdate={handlePasswordUpdate}/>
            <Button color="error" fullWidth variant="outlined" sx={{ mb: 2 }} 
                    onClick={() => setOpenDeleteDialog(true)}
                >
                    Delete profile
            </Button>
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