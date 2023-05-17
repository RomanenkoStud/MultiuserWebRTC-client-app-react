import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";
import { LogoAnimationProvider } from "../../components/NavBar/LogoAnimationContext";
import AuthController from '../../controllers/AuthController';
import LoginView from "../../views/LoginView";
import HomeView from "../../views/HomeView";
import NavBar from "../../components/NavBar/NavBar";
import AppTheme from "../../components/AppTheme";
import '@testing-library/jest-dom/extend-expect';
import configureMockStore from 'redux-mock-store';

const mockStore = configureMockStore();

jest.mock('../../services/auth.service', () => ({
    __esModule: true,
    default: {
        login: jest.fn(),
        logout: jest.fn(),
    }
}));

describe('AuthController', () => {

    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                isLoggedIn: false,
                user: null,
            },
            settings: {
                theme: 'light',
                config: {
                    mic: false,
                    cam: false,
                    blur: false,
                },
            }
        });
    });

    test('login user', async () => {
        const user = { email: 'testuser@example.com', password: 'password' };
        const userResponse = { username: 'testuser', email: 'testuser@example.com' };
        const authServiceMock = require('../../services/auth.service').default;
        authServiceMock.login.mockResolvedValueOnce({ data: userResponse });

        render(
            <Provider store={store}>
                <AppTheme>
                <LogoAnimationProvider>
                <AuthController>
                <Router initialEntries={['/login']}>
                    <NavBar/>
                    <Routes>
                        <Route path="/" element={<HomeView />} />
                        <Route path="/login/" element={<LoginView />} />
                    </Routes>
                </Router>
                </AuthController>
                </LogoAnimationProvider>
                </AppTheme>
            </Provider>
        );
        
        const emailInput = screen.getByRole("textbox", { name: /email/i });
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByText("Submit");

        userEvent.type(emailInput, user.email);
        userEvent.type(passwordInput, user.password);
        userEvent.click(submitButton);

        expect(authServiceMock.login).toHaveBeenCalledWith(
            user
        );

        await waitFor(() => {
            expect(store.getActions()).toEqual([
                { type: 'auth/login', payload: userResponse },
            ]);
        },
        {
          timeout: 25000, // Adjust the timeout value as needed
        });  
    });
});