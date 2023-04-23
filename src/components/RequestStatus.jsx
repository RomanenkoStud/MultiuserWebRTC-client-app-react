import { useState, useEffect } from 'react';
import { 
    Box, 
    Alert,
    CircularProgress
} from '@mui/material';

export default function RequestStatus({message, link, displayTime }) {

    const [displayed, setDisplayed] = useState(true);

    useEffect(() => {
        if(displayTime)
        {
            let timer;
            setDisplayed(true);
                timer = setTimeout(() => {
                    setDisplayed(false);
            }, displayTime);
            return () => clearTimeout(timer);
        }
    }, [message, link, displayTime]);

    return displayed && (
            message.loading ? (
                <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
                    <CircularProgress size={20} />
                </Box>
            ) : (
                message.message && (
                    <Alert severity={message.successful ? 'success' : 'error'}>
                    {message.message + " "}
                    {link}
                    </Alert>
                )
            )
    );
}