import {
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

function ParticipantsList({participants, isOpen, onClose}) {

    return (
        <Dialog open={isOpen} onClose={onClose} >
        <DialogTitle>Participants</DialogTitle>
        <DialogContent>
            <List style={{ minWidth: '200px', minHeight: '100px', 
                maxHeight: '300px', overflowY: 'auto' }} id="participants-container">
            {participants.map((participant) => (
                <ListItem key={participant.id}>
                    <ListItemAvatar>
                        <Avatar>
                        {participant.imageUrl ? (
                            <img src={participant.imageUrl} alt="Profile"
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                            }}/>
                        ) : (
                            participant.username.charAt(0)
                        )}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                    primary={participant.username}
                    />
                </ListItem>
            ))}
            </List>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" onClick={onClose}>
                Close
            </Button>
        </DialogActions>
        </Dialog>
    );
}

export default ParticipantsList;
