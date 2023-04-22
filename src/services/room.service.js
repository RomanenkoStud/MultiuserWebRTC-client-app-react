class RoomService {
    async create({roomname, maxUsers, isPrivate, password}, token) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "ok" });
            }, 1000); // Simulate a 1 second delay
        });
    }

    async getId(roomname) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(555);
            }, 1000); // Simulate a 1 second delay
        });
    }

    async getRooms() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { roomname: "room1", id: 1, maxUsers: 4, date: "2023-04-02", isPrivate: false, users: ["Tom", "Ben", "Joe"] },
                    { roomname: "room3", id: 2, maxUsers: 3, date: "2023-04-04", isPrivate: false, users: ["Alex", "Ben"] },
                    { roomname: "room2", id: 3, maxUsers: 2, date: "2023-04-03", isPrivate: true, users: ["Monica", "Ross"] },
                    { roomname: "room4", id: 4, maxUsers: 4, date: "2023-04-05", isPrivate: true, users: ["Sam"] },
                ]);
            }, 1000); // Simulate a 1 second delay
        });
    }

    async getUserRooms(userId, token) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { roomname: "room1", id: 1, maxUsers: 4, date: "2023-04-02", isPrivate: false, users: ["Tom", "Ben", "Joe"] },
                    { roomname: "room3", id: 2, maxUsers: 3, date: "2023-04-04", isPrivate: false, users: ["Alex", "Ben"] },
                    { roomname: "room2", id: 3, maxUsers: 2, date: "2023-04-03", isPrivate: true, users: ["Monica", "Ross"] },
                    { roomname: "room4", id: 4, maxUsers: 4, date: "2023-04-05", isPrivate: true, users: ["Sam"] },
                ]);
            }, 1000); // Simulate a 1 second delay
        });
    }

    async join(username, roomId, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ status: "ok" });
                //reject("Unable to join room");
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
        // Delete if admin else error
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: "ok" });
            }, 1000); // Simulate a 1 second delay
        });
    }
}

const roomService = new RoomService(); 

export default roomService;