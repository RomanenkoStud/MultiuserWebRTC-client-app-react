import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ProfileView from '../views/ProfileView';

describe('ProfileView', () => {
    const user = {
        username: 'johndoe',
        email: 'johndoe@example.com',
        status: 'Hello, World!',
        imageUrl: 'https://picsum.photos/200',
    };
    const handleUpdate = jest.fn();
    const handlePasswordUpdate = jest.fn();
    const handleDelete = jest.fn();
    
    it('renders with the correct user details', () => {
        render(<ProfileView user={user} handleUpdate={handleUpdate} handlePasswordUpdate={handlePasswordUpdate} handleDelete={handleDelete} />);
        
        expect(screen.getByRole('textbox', { name: /username/i })).toHaveValue('johndoe');
        expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('johndoe@example.com');
        expect(screen.getByRole('textbox', { name: /status/i })).toHaveValue('Hello, World!');
        expect(screen.getByRole('img', { name: /Profile/i })).toHaveAttribute('src', 'https://picsum.photos/200');
    });
    
    it('handles form submission correctly', () => {
        render(<ProfileView user={user} handleUpdate={handleUpdate} handlePasswordUpdate={handlePasswordUpdate} handleDelete={handleDelete} />);
    
        userEvent.clear(screen.getByRole('textbox', { name: /username/i }));
        userEvent.type(screen.getByRole('textbox', { name: /username/i }), 'janedoe');
        userEvent.click(screen.getByRole('button', { name: /Save changes/ }));
    
        expect(handleUpdate).toHaveBeenCalledTimes(1);
        expect(handleUpdate).toHaveBeenCalledWith({
            ...user,
            username: 'janedoe',
        }, expect.any(Function), expect.any(Function));
    });
    
    it('opens the image modal on button click', () => {
        render(<ProfileView user={user} handleUpdate={handleUpdate} handlePasswordUpdate={handlePasswordUpdate} handleDelete={handleDelete} />);
    
        userEvent.click(screen.getByRole('button', { name: /Change profile picture/ }));
        expect(screen.getByRole('dialog')).toBeVisible();
    });
    
    it('opens the delete dialog on button click', () => {
        render(<ProfileView user={user} handleUpdate={handleUpdate} handlePasswordUpdate={handlePasswordUpdate} handleDelete={handleDelete} />);
    
        userEvent.click(screen.getByRole('button', { name: /Delete profile/ }));
        expect(screen.getByRole('dialog')).toBeVisible();
    });
});