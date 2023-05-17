import userService from '../../services/user.service';
import authService from '../../services/auth.service';
import '@testing-library/jest-dom/extend-expect';

describe('UserService', () => {
    let userId;
    let token;

    test('registers a user', async () => {
        const userData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
        };

        await userService.register(userData).then(
        (response) => {
            // Verify the response
            expect(response.status).toBe(200);
            expect(response.data.username).toBe(userData.username);
            expect(response.data.email).toBe(userData.email);
        },
        (error) => {
            // handle error
        }
        );
    });

    test('logs in and gets user information', async () => {
        // Login to get a token
        await authService.login({
            email: 'testuser@example.com',
            password: 'password',
        }).then(
            (response) => {
                userId = response.data.id;
                token = response.data.token;
            },
            (error) => {
                // handle error
            }
        );

        await userService.get(userId).then(
        (response) => {
            // Verify the response
            expect(response.status).toBe(200);
            expect(response.data.id).toBe(userId);
            expect(response.data.username).toBeDefined();
            expect(response.data.email).toBeDefined();
            expect(response.data.password).not.toBeDefined();
        },
        (error) => {
            // handle error
        }
        );
    });

    test('updates user information', async () => {
        const updatedUserData = {
            id: userId,
            username: 'newusername',
            email: 'newemail@example.com',
            password: 'newpassword',
            status: 'active',
            imageUrl: 'https://example.com/avatar.jpg',
            token: token,
        };

        await userService.update(updatedUserData).then(
        (response) => {
            // Verify the response
            expect(response.status).toBe(200);
            expect(response.data.username).toBe(updatedUserData.username);
            expect(response.data.email).toBe(updatedUserData.email);
            expect(response.data.password).not.toBeDefined();
        },
        (error) => {
            // handle error
        }
        );
    });

    test('deletes a user', async () => {
        const deleteData = {
            id: userId,
            token: token,
        };

        await userService.delete(deleteData).then(
            (response) => {
                // Verify the response
                expect(response.status).toBe(204);
                // Additional assertions if needed
            },
            (error) => {
                // handle error
            }
        );
    });
});