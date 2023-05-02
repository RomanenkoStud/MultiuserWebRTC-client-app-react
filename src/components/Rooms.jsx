import { useState } from "react";
import { 
    CardActions, 
    Box, 
    Grid, 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    Avatar, 
    AvatarGroup,
    IconButton 
} from "@mui/material";
import { 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    ListItemButton,
    Collapse,
} from '@mui/material';
import DuoIcon from '@mui/icons-material/Duo';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useLogoAnimation } from "../hooks/useLogoAnimation";


const dateFormat = (date) => {
    const dateObj = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
}

const UserAvatar = ({user}) => {
    return (
        <Avatar key={user.username} image={user.imageUrl}>
            {user.imageUrl ? (
                <img src={user.imageUrl} alt={user.username}
                style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                }}/>
            ) : 
                user.username.charAt(0).toUpperCase()
            }
        </Avatar>
    );
}

const NoRoomsFound = () => {
    return (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Typography variant="h8" sx={{ mt: 4 }}>
            No rooms found.
        </Typography>
        </Box>
    );
};

const RoomsList = ({ rooms, handleDelete }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const { navigate } = useLogoAnimation();

    const handleRoomClick = (room) => {
        setSelectedRoom(selectedRoom === room ? null : room);
    };

    if(!rooms.length) {
        return (<NoRoomsFound/>);
    }

    return (
        <List sx={{ marginTop: 2 }} data-testid="list-view">
            {rooms.map((room) => (
            <Box key={room.id}>
                <ListItem
                secondaryAction={
                    <IconButton edge="end" aria-label="comments"  data-testid={`invite-icon-button-${room.id}`}
                        onClick={()=>navigate(`/rooms/invite/${room.id}`)}
                    >
                        <DuoIcon />
                    </IconButton>
                }
                disablePadding
                >
                <ListItemButton onClick={() => handleRoomClick(room)}>
                    <ListItemAvatar>
                    {room.users ? (
                        <UserAvatar user={room.users[0]}/>
                    ) : (
                        <Avatar>{room.roomname.charAt(0).toUpperCase()}</Avatar>
                    )}
                    </ListItemAvatar>
                    <ListItemText primary={room.roomname} secondary={
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {`Max Users: ${room.maxUsers}`}
                        </Typography>} />
                    {selectedRoom === room ? <ExpandLess /> : <ExpandMore />}
                    {handleDelete && (
                        <IconButton edge="end" aria-label="comments" data-testid={`delete-icon-button-${room.id}`}
                            onClick={()=>handleDelete(room.id)}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                    )}
                </ListItemButton>
                </ListItem>
                <Collapse in={selectedRoom === room} timeout="auto" unmountOnExit>
                    <Typography variant="body2" sx={{ pl: 10, color: 'text.secondary' }}>
                            {`Date: ${dateFormat(room.date)}`}
                            <br/>
                            {room.isPrivate ? "Private Room" : "Public Room"}
                    </Typography>
                </Collapse>
            </Box>
            ))}
        </List>
    );
};

const RoomsGrid = ({rooms, handleDelete}) => {
    const { navigate } = useLogoAnimation();

    if(!rooms.length) {
        return (<NoRoomsFound/>);
    }

    return (
        <Grid container spacing={3} sx={{ marginTop: 2 }} data-testid="grid-view">
            {rooms.map((room) => (
                <Grid item xs={12} md={6} lg={4} key={room.id}>
                    <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                        {room.roomname}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Max Users: {room.maxUsers}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Date: {dateFormat(room.date)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                        {room.isPrivate ? "Private Room" : "Public Room"}
                        </Typography>
                        <AvatarGroup max={4} sx={{height: 44}}>
                            {room.users?.map((user) => (
                                <UserAvatar key={user.username} user={user}/>
                            ))}
                        </AvatarGroup>
                    </CardContent>
                    <CardActions>
                        <Button  variant="outlined" color="primary" data-testid={`invite-button-${room.id}`}
                            onClick={()=>navigate(`/rooms/invite/${room.id}`)}
                        >
                            Join
                        </Button>
                        {handleDelete && (<Button  variant="outlined" color="error" data-testid={`delete-button-${room.id}`}
                            onClick={()=>handleDelete(room.id)}
                        >
                            Delete
                        </Button>)}
                    </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default function Rooms({rooms, viewType, handleDelete}) {
    switch (viewType) {
        case 'grid':
            return <RoomsGrid rooms={rooms} handleDelete={handleDelete}/>
        case 'list':
            return <RoomsList rooms={rooms} handleDelete={handleDelete}/>
        default:
            return <RoomsGrid rooms={rooms} handleDelete={handleDelete}/>
    }
}