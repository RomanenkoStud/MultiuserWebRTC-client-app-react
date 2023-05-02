import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import CreateRoomView from '../views/CreateRoomView';

describe('CreateRoomView', () => {
    it('renders room name input', () => {
        render(<CreateRoomView />);
        const roomNameInput = screen.getByTestId('room-name-input');
        expect(roomNameInput).toBeInTheDocument();
    });

    it('renders room type input', () => {
        render(<CreateRoomView />);
        const roomTypeInput = screen.getByTestId('room-type-input');
        expect(roomTypeInput).toBeInTheDocument();
    });

    it('renders room password input when room type is private', () => {
        render(<CreateRoomView />);
        const privateRoomRadio = screen.getByRole('radio', { name: 'Private' });
        userEvent.click(privateRoomRadio);
        const roomPasswordInput = screen.getByTestId('room-password-input');
        expect(roomPasswordInput).toBeInTheDocument();
    });

    it('does not render room password input when room type is public', () => {
        render(<CreateRoomView />);
        const publicRoomRadio = screen.getByRole('radio', { name: 'Public' });
        userEvent.click(publicRoomRadio);
        const roomPasswordInput = screen.queryByTestId('room-password-input');
        expect(roomPasswordInput).not.toBeInTheDocument();
    });

    it('renders max users input', () => {
        render(<CreateRoomView />);
        const maxUsersInput = screen.getByTestId('max-users-input');
        expect(maxUsersInput).toBeInTheDocument();
    });

    it('renders create room button', () => {
        render(<CreateRoomView />);
        const createRoomButton = screen.getByTestId('create-room-button');
        expect(createRoomButton).toBeInTheDocument();
    });

    it('calls handleCreate with correct data when form is submitted', () => {
        const handleCreate = jest.fn();
        render(<CreateRoomView handleCreate={handleCreate} />);
        const roomNameInput = screen.getByRole('textbox', { name: 'Room Name' });
        userEvent.type(roomNameInput, 'test room');

        const publicRoomRadio = screen.getByRole('radio', { name: 'Public' });
        userEvent.click(publicRoomRadio);

        const maxUsersInput = screen.getByRole('spinbutton', { name: 'Maximum Number of Users' });
        userEvent.type(maxUsersInput, '3');

        const createRoomButton = screen.getByTestId('create-room-button');
        userEvent.click(createRoomButton);

        expect(handleCreate).toHaveBeenCalledWith(
        {
            roomName: 'test room',
            isPrivate: false,
            maxUsers: '3',
            password: '',
        },
        expect.any(Function),
        expect.any(Function)
        );
    });
});