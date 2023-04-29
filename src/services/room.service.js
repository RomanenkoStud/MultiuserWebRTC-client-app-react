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

    async getRooms() {
        //return axios.get(`${this.apiUrl}?page=${1}&size=${10}`);
        return axios.get(`${this.apiUrl}`);
    }

    async getUserRooms(userId, token) {
        return axios.get(`${this.apiUrl}/${userId}`, { headers: authHeader(token) });
    }

    async delete(roomId, token) {
        return axios.delete(`${this.apiUrl}/${roomId}`, { headers: authHeader(token) });
    }
}

const roomService = new RoomService(); 

export default roomService;