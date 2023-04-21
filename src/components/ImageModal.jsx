import { useState } from 'react';
import {
    Button,
    TextField,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Avatar
} from '@mui/material';


const ImageModal = ({open, handleClose, setImage}) => {
    const [imageUrl, setImageUrl] = useState('');

    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value);
    };

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        >
            <DialogTitle>Change picture</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, width: 300}}>
                    {imageUrl ? (
                        <Avatar
                            src={imageUrl}
                            sx={{ width: 100, height: 100 }}
                        />
                    ) : (
                        <Avatar sx={{ width: 100, height: 100 }}>
                            None
                        </Avatar>
                    )}
                </Box>
                <TextField
                    id="image-url"
                    label="Image URL"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <DialogActions>
                    <Button variant="contained" onClick={()=>setImage(imageUrl)}>
                        Save
                    </Button>
                    <Button variant="outlined" onClick={()=>handleClose()}>
                        Cancel
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default ImageModal;