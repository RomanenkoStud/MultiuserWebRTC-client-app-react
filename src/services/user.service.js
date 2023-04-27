import axios from 'axios';
import HOST from './host';
import authHeader from './auth-header';

class UserService {
    constructor() {
        this.apiUrl = HOST + '/api/v1/users';
    }

    async register({username, email, password}) {
        return axios.post(`${this.apiUrl}/register`, {
            username,
            email,
            password
        });
    }

    async get(id) {
        return axios.get(`${this.apiUrl}/${id}`);
    }

    async update({id, username, email, password, status, imageUrl, token}) {
        return axios.put(`${this.apiUrl}/${id}`, {
            username,
            email,
            password,
            status,
            imageUrl
        }, { headers: authHeader(token) });
    }

    async delete({id, token}) {
        return axios.delete(`${this.apiUrl}/${id}`, { headers: authHeader(token) });
    }
}

const userService = new UserService(); 

export default userService;