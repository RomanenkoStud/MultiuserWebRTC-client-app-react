class RoomService {
    async create({roomname, maxUsers, date, isPrivate, password}, token) {
        //if (isPrivate = false) password = null
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "ok" });
            }, 1000); // Simulate a 1 second delay
        });
    }

    async searchRooms({roomname, maxUsers, date, isPrivate,}, page, pageSize) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ 
                    rooms: [{roomname: "roomname", maxUsers: 4, date: "date", isPrivate,},], 
                    numberOfPages: "number", 
            });
            }, 1000); // Simulate a 1 second delay
        });
    }

    async join(username, roomname, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "ok" });
            }, 1000); // Simulate a 1 second delay
        });
    }

    async leave(username, roomname) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "ok" });
            }, 1000); // Simulate a 1 second delay
        });
    }

    async delete(roomname, token) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "ok" });
            }, 1000); // Simulate a 1 second delay
        });
    }
}

const roomService = new RoomService(); 

export default roomService;