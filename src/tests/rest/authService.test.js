import authService from '../../services/auth.service';
import '@testing-library/jest-dom/extend-expect';

describe('authService', () => {

    test('Login user', async () => {
        const user = {
            email: 'testuser1@example.com',
            password: 'password',
        }
        await authService.login(user).then(
            (response) => {
                expect(response.status).toBe(200);
                expect(response.data.email).toBe(user.email);
                expect(response.data.token).toBeDefined();
            },
            (error) => {
            }
        );
    });

    test('Logout user', async () => {
        await authService.logout().then(
            (response) => {
                expect(response.status).toBe(200);
            },
            (error) => {
            }
        );
    });
});