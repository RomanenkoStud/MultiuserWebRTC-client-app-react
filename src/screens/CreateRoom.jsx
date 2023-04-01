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

const CreateRoom = () => {
    const [roomName, setRoomName] = useState('');
    const [roomType, setRoomType] = useState('public');
    const [roomPassword, setRoomPassword] = useState('');
    const [maxUsers, setMaxUsers] = useState('');

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
                    margin="normal"
                    required
                    fullWidth
                    id="room-name"
                    label="Room Name"
                    name="room-name"
                    autoComplete="off"
                    value={roomName}
                    onChange={handleRoomNameChange}
                />
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">Room Type</FormLabel>
                    <RadioGroup row aria-label="room type" name="room-type" value={roomType} onChange={handleRoomTypeChange}>
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
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Create Room
                </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default CreateRoom;