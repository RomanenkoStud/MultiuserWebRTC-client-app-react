import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

function Chat({isOpen, onClose, socket, localUsername, roomName}) {
    const theme = useTheme();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    const handleMessageInput = (event) => {
        setMessageInput(event.target.value);
    };

    const handleSendMessage = () => {
        if (messageInput.trim() !== '') {
        const now = new Date();
        const newMessage = {
            id: messages.length,
            text: messageInput.trim(),
            time: `${now.getHours()}:${now.getMinutes()}`,
        };
        setMessages([...messages, { username: "you", message: newMessage }]);
        // Send the new message to the server
        socket.current.emit('message', { username: localUsername, room: roomName, message: newMessage });
        setMessageInput('');
        }
    };

    useEffect(() => {
        // Scroll to the bottom of the messages list
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        socket.current.off('message');
        socket.current.on('message', (message, username) => {
            setMessages((prevMessages) => [...prevMessages,  { username: username, message: message }]);
        });
    }, [socket]);

    return (
        <Dialog open={isOpen} onClose={onClose} >
        <DialogTitle>Chat</DialogTitle>
        <DialogContent>
            <List style={{ maxHeight: '300px', overflowY: 'auto' }} id="messages-container">
            {messages.map((element) => (
                <ListItem
                key={element.message.id}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: element.username === "you" ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                }}
                >
                <ListItemText
                    primary={element.message.text}
                    secondary={`From ${element.username} at ${element.message.time}`}
                    style={{
                        background: element.username === "you" ? '#eee' : theme.palette.primary.light,
                        borderRadius: '15px',
                        padding: '10px',
                        maxWidth: '70%',
                        wordWrap: 'break-word',
                    }}
                />
                </ListItem>
            ))}
            </List>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}>
            <TextField
                style={{ flexGrow: 1, marginRight: '16px' }}
                label="Message"
                value={messageInput}
                onChange={handleMessageInput}
                onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    handleSendMessage();
                }
                }}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage}>
                Send
            </Button>
            </div>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" onClick={onClose}>
                Close
            </Button>
        </DialogActions>
        </Dialog>
    );
}

export default Chat;