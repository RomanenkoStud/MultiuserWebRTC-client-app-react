import axios from "axios";
import HOST from './host';

class AuthService {
    constructor() {
        this.apiUrl = HOST + '/api/v1/auth/';
    }

    login({email, password}) {
        return axios
            .post(this.apiUrl + "login", {
                email,
                password
            });
        }
    
    logout() {
        return axios
            .post(this.apiUrl + "logout");
    }
}

const authService = new AuthService();

export default authService;