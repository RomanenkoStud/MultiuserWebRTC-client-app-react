import { Snackbar, Alert } from '@mui/material';

const NotificationPanel = ({ notifications, removeNotification }) => {
    return (
        <>
        {notifications.map((notification) => (
            <Snackbar
            key={notification.id}
            open={notification.open}
            autoHideDuration={6000}
            onClose={() => removeNotification(notification.id)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
            <Alert onClose={() => removeNotification(notification.id)} severity={notification.severity}>
                {notification.message}
            </Alert>
            </Snackbar>
        ))}
        </>
    );
};

export default NotificationPanel;