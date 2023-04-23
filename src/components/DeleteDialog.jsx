import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    DialogContentText
} from '@mui/material';


const DeleteDialog = ({open, handleClose, handleDelete}) => {

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle color="error">Delete profile?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete your profile? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDelete} color="error">Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;