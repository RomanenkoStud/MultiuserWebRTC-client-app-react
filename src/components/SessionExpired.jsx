import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function SessionExpiredModal({sessionExpired, handleSessionExpired}) {
    return (
        <Dialog open={sessionExpired} onClose={handleSessionExpired}>
        <DialogTitle>Session Expired</DialogTitle>
        <DialogContent>
            <p>Your session has expired. Please log in again.</p>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" onClick={handleSessionExpired}>OK</Button>
        </DialogActions>
        </Dialog>
    );
}