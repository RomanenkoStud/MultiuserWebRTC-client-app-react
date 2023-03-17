import { Box } from '@mui/material';
import { Avatar } from '@mui/material';
import { Typography } from '@mui/material';

function UserVideoPlaceholder(props) {
    return (
        <Box sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: "translateZ(0)", 
                    // force whole pixel rendering
                    // prevent sub-pixel rendering
                bgcolor: (theme) => theme.palette.primary.dark,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                }} >
            <Avatar sx={{ bgcolor: 'default', width: '50%', height: '50%'  }}>
                <Typography sx={{ fontSize: 40 }}>{props.username}</Typography>
            </Avatar>
            {props.children}
        </Box>
    );
}

export default UserVideoPlaceholder;