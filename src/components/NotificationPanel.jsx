import { List, ListItem, Alert, Box, Drawer, Link, Typography } from "@mui/material";
import { useState } from 'react';

const Notification = ({ notification, removeNotification }) => {
    const [showFull, setShowFull] = useState(false);
    const buttonStyle = { mt: 1, cursor: 'pointer' };

    const toggleShowFull = () => {
        setShowFull((prev) => !prev);
    };

    const showMore = notification.message.length > 30 || notification.link;

    const message = !showMore || showFull
    ? notification.message
    : notification.message.slice(0, 50) + '...';
    
    const link = notification.link && showFull
    ? (
        <Link 
        href={notification.link} 
        color="inherit" 
        target="_blank" 
        rel="noopener">
            Click here
        </Link>
    )
    : null;

    return (
    <Alert
        onClose={() => removeNotification(notification.id)}
        severity={notification.severity}
        sx={{
            width: "100%",
        }}
    >
        <Box>
            {message}
        </Box>
        {link}
        {showMore &&
            (showFull ? (
                <Box onClick={toggleShowFull} sx={buttonStyle}>
                    Show less
                </Box >
            ) : (
                <Box onClick={toggleShowFull} sx={buttonStyle}>
                    Show more
                </Box >
            ))
        }
    </Alert>
);
};

const NotificationPanel = ({ isOpen, onClose, notifications, removeNotification}) => {
    return (
        <Drawer anchor="left" open={isOpen} onClose={onClose}>
            <List sx={{ 
                width: 300, 
                maxHeight: "100%",
                overflow: 'auto',
                '::-webkit-scrollbar': {
                    display: 'none',
                }, 
                }}>
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <ListItem key={notification.id}>
                            <Notification
                                notification={notification}
                                removeNotification={removeNotification}
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography sx={{ p: 3 }}>No new notifications</Typography>
                )}
            </List>
        </Drawer>
    );
};

export default NotificationPanel;