import { 
    Box, 
    Alert,
    CircularProgress
} from '@mui/material';

export default function RequestStatus({message}) {

    return (
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
                    </Alert>
                )
            )
    );
}