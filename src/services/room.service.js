import axios from 'axios';
import HOST from './host';
import authHeader from './auth-header';

class RoomService {
    constructor() {
        this.apiUrl = HOST + '/api/v1/rooms';
    }

    async create(room, token) {
        return axios.post(`${this.apiUrl}`, room, { headers: authHeader(token) });
    }

    async getId(roomname) {
        return axios.get(`${this.apiUrl}/connect?name=${roomname}`);
    }

    async getRooms() {
        return axios.get(`${this.apiUrl}`);
    }

    async getUserRooms(userId, token) {
        return axios.get(`${this.apiUrl}/${userId}`, { headers: authHeader(token) });
    }

    async join(username, roomId, password) {
        return axios.post(`${this.apiUrl}/connect/${roomId}`, {username, password});
    }

    async leave(username, roomId) {
        return axios.delete(`${this.apiUrl}/connect/${roomId}?username=${username}`);
    }

    async delete(roomId, token) {
        return axios.delete(`${this.apiUrl}/${roomId}`, { headers: authHeader(token) });
    }
}

const roomService = new RoomService(); 

export default roomService;