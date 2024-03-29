import React, { useState } from 'react';
import { 
    CssBaseline, 
    Box, 
    Button, 
    Container, 
    FormControl, 
    FormControlLabel, 
    FormLabel, 
    Radio, 
    RadioGroup, 
    TextField, 
    Typography 
} from '@mui/material';
import RequestStatus from "../components/RequestStatus";

const CreateRoomView = ({handleCreate}) => {
    const [roomName, setRoomName] = useState('');
    const [roomType, setRoomType] = useState('public');
    const [roomPassword, setRoomPassword] = useState('');
    const [maxUsers, setMaxUsers] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState({message: "", successfull: false, loading: false});

    const handleRoomNameChange = (event) => {
        setRoomName(event.target.value);
    };

    const handleRoomTypeChange = (event) => {
        setRoomType(event.target.value);
    };

    const handleRoomPasswordChange = (event) => {
        setRoomPassword(event.target.value);
    };

    const handleMaxUsersChange = (event) => {
        setMaxUsers(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // handle form submission
        handleCreate({
            roomName: roomName, 
            isPrivate: roomType === 'private',
            maxUsers: maxUsers,
            password: roomPassword
        }, setError, setMessage);
    };

    return (
        <Container maxWidth="sm">
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Typography component="h1" variant="h5">
            Create a Room
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                    error={error}
                    helperText={error ? 'Error. Too short room name' : ''}
                    margin="normal"
                    required
                    fullWidth
                    id="room-name"
                    label="Room Name"
                    name="room-name"
                    autoComplete="off"
                    value={roomName}
                    onChange={handleRoomNameChange}
                    data-testid="room-name-input"
                />
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">Room Type</FormLabel>
                    <RadioGroup
                    row
                    aria-label="room type"
                    name="room-type"
                    value={roomType}
                    onChange={handleRoomTypeChange}
                    data-testid="room-type-input"
                    >
                    <FormControlLabel value="public" control={<Radio />} label="Public" />
                    <FormControlLabel value="private" control={<Radio />} label="Private" />
                    </RadioGroup>
                </FormControl>
                {roomType === 'private' && (
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="room-password"
                    label="Room Password"
                    name="room-password"
                    autoComplete="off"
                    value={roomPassword}
                    onChange={handleRoomPasswordChange}
                    data-testid="room-password-input"
                    />
                )}
                <TextField
                    margin="normal"
                    fullWidth
                    id="max-users"
                    label="Maximum Number of Users"
                    name="max-users"
                    autoComplete="off"
                    type="number"
                    inputProps={{ min: 2, max: 4 }}
                    value={maxUsers}
                    onChange={handleMaxUsersChange}
                    data-testid="max-users-input"
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} data-testid="create-room-button">
                    Create Room
                </Button>
                <RequestStatus message={message}/>
            </Box>
        </Box>
        </Container>
    );
};

export default CreateRoomView;