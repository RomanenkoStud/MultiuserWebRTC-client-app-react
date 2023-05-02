import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import ConnectView from '../views/ConnectView';

describe('ConnectView', () => {
    const handleConnect = jest.fn();
    
    it('should submit form with provided values', () => {
        render(<ConnectView handleConnect={handleConnect} />);
        const usernameInput = screen.getByRole('textbox', { name: 'User' });
        const roomIdInput = screen.getByRole('textbox', { name: 'Room' });
        const connectButton = screen.getByTestId('connect-button');
        const username = 'testuser2';
        const roomId = '123456';
        
        userEvent.type(usernameInput, "testuser2");
        userEvent.type(roomIdInput, "123456");
        userEvent.click(connectButton);
    
        expect(handleConnect).toHaveBeenCalledWith(username, roomId, expect.any(Function));
    });

    it('should not allow non-numeric characters in room ID', () => {
        render(<ConnectView handleConnect={handleConnect} />);
        const roomIdInput = screen.getByRole('textbox', { name: 'Room' });
        userEvent.type(roomIdInput, 'abcd12');
    
        expect(roomIdInput.value).toBe('12');
    });

    it('should pre-fill username input with user prop value', () => {
        const user = { username: 'testuser1' };
        render(<ConnectView handleConnect={handleConnect} user={user} />);
        const usernameInput = screen.getByRole('textbox', { name: 'User' });
        expect(usernameInput.value).toBe(user.username);
    });
    
    it('should make username input readOnly when user prop is defined', () => {
        const user = { username: 'testuser1' };
        render(<ConnectView handleConnect={handleConnect} user={user} />);
        const usernameInput = screen.getByRole('textbox', { name: 'User' });
        expect(usernameInput).toHaveAttribute('readOnly');
    });
    
    it('should enable username input when user prop is not defined', () => {
        render(<ConnectView handleConnect={handleConnect} />);
        const usernameInput = screen.getByRole('textbox', { name: 'User' });
        expect(usernameInput).not.toHaveAttribute('readOnly');
    });
});