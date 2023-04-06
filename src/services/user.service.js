import axios from 'axios';

//const API_URL = "http://localhost:8080/api/v1/users/";
const API_URL = "https://server-app-spring.azurewebsites.net/api/v1/users/";

class UserService {
    register(username, email, password) {
        return axios.post(API_URL + "register", {
            username,
            email,
            password
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