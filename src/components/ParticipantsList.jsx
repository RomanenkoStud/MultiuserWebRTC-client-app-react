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
                <ListItem key={participant}>
                    <ListItemAvatar>
                        <Avatar>
                            {participant.charAt(0)}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                    primary={participant}
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
