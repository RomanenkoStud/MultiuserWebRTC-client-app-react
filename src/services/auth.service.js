class AuthService {
    login(email, password) {
        //api call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    token: "token", email: "email", username: "username"});
            }, 1000); // Simulate a 1 second delay
        });
}

    logout() {
        //api call
    }
}

const authService = new AuthService();

export default authService;