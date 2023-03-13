import React, { useState, useEffect } from 'react';
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
        setMessages([...messages, { username: localUsername, message: newMessage }]);
        // Send the new message to the server
        if(socket) {
            socket.emit('message', { username: localUsername, room: roomName, message: newMessage });
        }
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
        if(socket) {
            // Listen for incoming messages from the server
            socket.on('message', (message, username) => {
                setMessages((prevMessages) => [...prevMessages,  { username: username, message: message }]);
            });

            // Clean up the event listener when the component unmounts
            return () => {
                socket.off('message');
            };
        }
    }, [socket]);

    return (
        <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Chat</DialogTitle>
        <DialogContent>
            <List style={{ maxHeight: '300px', overflowY: 'auto' }} id="messages-container">
            {messages.map((element) => (
                <ListItem key={element.message.id}>
                    <ListItemText 
                    primary={element.message.text} 
                    secondary={`From ${element.username} at ${element.message.time}`}
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