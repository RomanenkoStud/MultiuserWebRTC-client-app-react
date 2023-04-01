class UserService {
    async register() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "ok" });
            }, 1000); // Simulate a 1 second delay
        });
    }

    async getUser() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ user: "ok" });
            }, 1000); // Simulate a 1 second delay
        });
    }
}

const userService = new UserService(); 

export default userService;