import { render, screen, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";
import userEvent from '@testing-library/user-event';
import Rooms from '../components/Rooms';
import { BrowserRouter as Router } from "react-router-dom";
import { LogoAnimationProvider } from "../components/NavBar/LogoAnimationContext";

describe('Rooms component', () => {
    const rooms = [
    {
        id: 1,
        roomname: 'Room 1',
        maxUsers: 4,
        date: '2022-05-03',
        isPrivate: true,
        users: [
            {
            username: 'User 1',
            imageUrl: 'https://example.com/user1.jpg',
            },
            {
            username: 'User 2',
            imageUrl: 'https://example.com/user2.jpg',
            },
        ],
        },
        {
        id: 2,
        roomname: 'Room 2',
        maxUsers: 8,
        date: '2022-05-04',
        isPrivate: false,
        },
    ];

    it('renders the RoomsGrid by default', () => {
        render(
        <LogoAnimationProvider>
            <Router>
                <Rooms rooms={rooms} />
            </Router>
        </LogoAnimationProvider>
        );
        expect(screen.getByTestId('grid-view')).toBeInTheDocument();
    });

    it('renders the RoomsList when viewType is "list"', () => {
        render(
            <LogoAnimationProvider>
                <Router>
                    <Rooms rooms={rooms} viewType="list" />
                </Router>
            </LogoAnimationProvider>
        );
        expect(screen.getByTestId('list-view')).toBeInTheDocument();
    });

    it('calls handleDelete when the Delete button is clicked', () => {
        const handleDelete = jest.fn();
        render(
            <LogoAnimationProvider>
                <Router>
                    <Rooms rooms={rooms} handleDelete={handleDelete} />
                </Router>
            </LogoAnimationProvider>
        );
        const deleteButton = screen.getByTestId('delete-button-1');
        userEvent.click(deleteButton);
        expect(handleDelete).toHaveBeenCalled();
    });

    it('expands and collapses a room when clicked in the RoomsList', async () => {
        render(
            <LogoAnimationProvider>
                <Router>
                <Rooms rooms={rooms} viewType="list" />
                </Router>
            </LogoAnimationProvider>
        );
        
        const roomName = screen.getByText(/room 1/i);
        userEvent.click(roomName);
    
        const expandedInfo = screen.getByText(/Date: May 3, 2022/i);
        expect(expandedInfo).toBeVisible();
    
        userEvent.click(roomName);
    
        await waitFor(() =>
            expect(expandedInfo).not.toBeVisible()
        );
    });
});