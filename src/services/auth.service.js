class AuthService {
    login(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem("user", JSON.stringify({
                    token: "token", email: "email", username: "username"}));
                resolve({
                    token: "token", email: "email", username: "username"});
            }, 1000); // Simulate a 1 second delay
        });
}

    logout() {
        localStorage.removeItem("user");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

const authService = new AuthService();

export default authService;