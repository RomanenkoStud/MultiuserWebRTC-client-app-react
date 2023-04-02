class UserService {
    async register(username, email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "ok" });
            }, 1000); // Simulate a 1 second delay
        });
    }

    async getUser(token) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ username: "username", email: "email", avatar: "image", status: "status" });
            }, 1000); // Simulate a 1 second delay
        });
    }

    async resetPassword(oldPassword, newPassword, token) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "ok" });
            }, 1000); // Simulate a 1 second delay
        });
    }
}

const userService = new UserService(); 

export default userService;