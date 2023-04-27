import { useCallback } from "react";
import { Route, Routes } from 'react-router-dom';
import CreateRoomView from "../views/CreateRoomView";
import SearchView from "../views/SearchView";
import ConnectView from "../views/ConnectView";
import { useSelector } from "react-redux";
import PrivateRoute from "../components/PrivateRoute";
import InviteView from "../views/InviteView";
import NotFoundView from "../views/NotFoundView";
import { useLogoAnimation } from "../hooks/useLogoAnimation";
import roomService from "../services/room.service";


const RoomController = () => {
    const user = useSelector((state) => state.auth.user);
    const { navigate } = useLogoAnimation();

    const roomInfoMap = (room) => {
        return {
            id: room.id,
            roomname: room.name,
            maxUsers: room.maxUsers,
            isPrivate: room.private,
            date : room.dateCreation,
            users: room.connectedUsers,
        }
    }

    const handleCreate = (room, setError, setMessage) => {
        const roomError = room.roomName.length >= 8 ? false : true;
        setError(roomError);
        if(!roomError) {
            setMessage({loading: true});
            roomService.create({
                name: room.roomName,
                numberOfUsers: room.maxUsers,
                private: room.isPrivate,
                password : room.password
            }, user.token).then(
                (response) => {
                    setMessage({successful: true, loading: false});
                    navigate(`/rooms/user`);
                },
                (error) => {
                    
                }
            );
        }
    };

    const handleGetRooms = useCallback((setRooms) => {
        roomService.getRooms().then(
            (response) => {
                const rooms = response.data.content.map(roomInfoMap)
                setRooms(rooms);
            },
            (error) => {
                // handle error
            }
        );
    }, []);

    const handleGetUserRooms = useCallback((setRooms) => {
        roomService.getUserRooms(user.id, user.token).then(
            (response) => {
                const rooms = response.data.content.map(roomInfoMap)
                setRooms(rooms);
            },
            (error) => {
                
            }
        );
    }, [user]);

    const handleDelete = (roomId) => {
        console.log("delete ", roomId)
        roomService.delete(roomId, user.token).then(
            (response) => {

            },
            (error) => {
                
            }
        );
    }

    const handleConnect = (username, roomname, setError, setMessage) => {
        const usernameError = username.length >= 8 ? false : true;
        const roomError = roomname.length >= 8 ? false : true;
        setError({username: usernameError, room: roomError});
        if(!usernameError && !roomError) {
            setMessage({loading: true});
            roomService.getId(roomname).then(
                (response) => {
                    const room = response.data;
                    setMessage({successful: true, loading: false});
                    navigate(`/call/${username}/${room.id}/${room.private}`);
                },
                (error) => {
                    
                }
            );
        }
    };

    const handleInvite = (username, roomId, isPrivate, setError) => {
        const usernameError = username.length >= 8 ? false : true;
        setError({username: usernameError});
        if(!usernameError) {
            navigate(`/call/${username}/${roomId}/${isPrivate}`);
        }
    };

    return (
        <Routes>
            <Route path="/" element={<SearchView handleGetRooms={handleGetRooms}/>} />
            <Route path="/user" element={
                <PrivateRoute component={SearchView} handleGetRooms={handleGetUserRooms} handleDelete={handleDelete}/>
            } />
            <Route path="/create" element={
                <PrivateRoute component={CreateRoomView} handleCreate={handleCreate}/>
            } />
            <Route path="/connect" element={<ConnectView user={user} handleConnect={handleConnect}/>} />
            <Route path="/invite/:room/:private" element={<InviteView user={user} handleConnect={handleInvite}/>} />
            <Route path="*" element={<NotFoundView />} />
        </Routes>
    );
};

export default RoomController;