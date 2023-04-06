import axios from "axios";

//const API_URL = "http://localhost:8080/api/v1/auth/";
const API_URL = "https://server-app-spring.azurewebsites.net/api/v1/auth/";

class AuthService {
    login(email, password) {
        return axios
            .post(API_URL + "login", {
                email,
                password
            });
        }
    
        logout() {
            axios
            .post(API_URL + "logout");
        }
}

const authService = new AuthService();

export default authService;