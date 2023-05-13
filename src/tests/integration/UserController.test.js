import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from "react-router-dom";
import { LogoAnimationProvider } from "../../components/NavBar/LogoAnimationContext";
import UserController from '../../controllers/UserController';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../services/user.service', () => ({
    __esModule: true,
    default: {
        register: jest.fn(),
        login: jest.fn(),
        update: jest.fn(),
    }
}));

describe('UserController', () => {
    test('registers user', async () => {
        const user = { username: 'testuser', email: 'testuser@example.com', password: 'password' };
        const userServiceMock = require('../../services/user.service').default;
        userServiceMock.register.mockResolvedValueOnce({ data: 'success' });

        // create a mock Redux store with the required state
        const store = {
            getState: () => ({ auth: {
                isLoggedIn: false,
                user: null,
            } }),
            dispatch: jest.fn(),
            subscribe: jest.fn()
        };

        render(
            <Provider store={store}>
                <LogoAnimationProvider>
                <Router initialEntries={['/register']}>
                <UserController />
                </Router>
                </LogoAnimationProvider>
            </Provider>
        );
        
        // fill in form fields with valid data
        const usernameInput = screen.getByRole("textbox", { name: /user/i });
        const emailInput = screen.getByRole("textbox", { name: /email/i });
        const passwordInput = screen.getByLabelText(/password/i);
        
        await userEvent.type(usernameInput, user.username);
        await userEvent.type(emailInput, user.email);
        await userEvent.type(passwordInput, user.password);
        
        // submit the form
        const submitButton = screen.getByRole("button", { name: /submit/i });
        await userEvent.click(submitButton);
        
        expect(userServiceMock.register).toHaveBeenCalledWith(user);
        
        // wait for success message to be displayed
        const successMessage = await screen.findByText(/Thanks for registration/i);
        expect(successMessage).toBeInTheDocument();
    });

    test('updates user', async () => {
        const user = { id: 1, username: 'testuser', email: 'testuser@example.com' };
        const userUpdated = { username: 'updateduser', email: 'updateduser@example.com' };
        const userServiceMock = require('../../services/user.service').default;
        userServiceMock.update.mockResolvedValueOnce({ data: 'success' });
    
        // create a mock Redux store with the required state
        const store = {
            getState: () => ({ auth: {
                isLoggedIn: true,
                user,
            } }),
            dispatch: jest.fn(),
            subscribe: jest.fn()
        };
    
        render(
            <Provider store={store}>
                <LogoAnimationProvider>
                    <Router>
                        <UserController />
                    </Router>
                </LogoAnimationProvider>
            </Provider>
        );
    
        // fill in form fields with valid data
        const usernameInput = screen.getByRole("textbox", { name: /user/i });
        const emailInput = screen.getByRole("textbox", { name: /email/i });
    
        await userEvent.clear(usernameInput);
        await userEvent.clear(emailInput);
    
        await userEvent.type(usernameInput, userUpdated.username);
        await userEvent.type(emailInput, userUpdated.email);
    
        
        // click the update button
        const updateButton = await screen.findByRole("button", { name: /Save changes/i });
        await userEvent.click(updateButton);
    
        expect(userServiceMock.update).toHaveBeenCalledWith({
            id: user.id,
            username: userUpdated.username,
            email: userUpdated.email,
            token: user.token,
        });
    });
});