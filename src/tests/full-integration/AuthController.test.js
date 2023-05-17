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

describe('AuthController', () => {

    let store;

    test('login user', async () => {
        const user = { email: 'testuser1@example.com', password: 'password' };
        const userResponse = { username: 'testuser', email: 'testuser1@example.com' };

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

        render(
            <Provider store={store}>
                <AppTheme>
                    <LogoAnimationProvider>
                        <AuthController>
                            <Router initialEntries={['/login']}>
                                <NavBar />
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

        await waitFor(() => {
            expect(store.getActions()[0]).toEqual({
                type: 'auth/login',
                payload: expect.objectContaining({
                    username: userResponse.username,
                    email: userResponse.email,
                }),
            });
        });
    });

    test('logout user', () => {
        store = mockStore({
            auth: {
                isLoggedIn: true,
                user: { 
                    username: 'testuser', 
                    email: 'testuser1@example.com',
                    token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2bG0uOXYucm9tYW5lbmtvLnBhdmxvQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjg0MzE3NjIxLCJleHAiOjE2ODQ5MjI0MjF9.g81XYLmzWPu8qsyF5UEKSFkJQ37aXnsU6TktAFmbd_o"
                },
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
        render(
            <Provider store={store}>
                <AppTheme>
                    <LogoAnimationProvider>
                        <AuthController>
                            <Router initialEntries={['/']}>
                                <NavBar />
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

        const accountButton = screen.getByRole('button', { name: /open drawer/i });
        userEvent.click(accountButton);
        const logoutButton = screen.getByRole('button', { name: /LogOut/i });
        userEvent.click(logoutButton);

        expect(store.getActions()[0]).toEqual({ type: 'auth/logout' });
    });
});