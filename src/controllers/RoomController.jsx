import { useState, useEffect } from "react";
import { Route, Routes } from 'react-router-dom';
import CreateRoomView from "../views/CreateRoomView";
import SearchView from "../views/SearchView";
import ConnectView from "../views/ConnectView";
import { useSelector } from "react-redux";
import PrivateRoute from "../components/PrivateRoute";
import InviteView from "../views/InviteView";
import { useLogoAnimation } from "../hooks/useLogoAnimation";
import roomService from "../services/room.service";


const RoomController = () => {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const user = useSelector((state) => state.auth.user);
    const { navigate } = useLogoAnimation();
    const [searchRooms, setSearchRooms] = useState([]);
    const [userRooms, setUserRooms] = useState([]);
    const [searchLoading, setSearchLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);

    const handleCreate = (room, setError, setMessage) => {
        const roomError = room.roomName.length >= 8 ? false : true;
        setError(roomError);
        if(!roomError) {
            setMessage({loading: true});
            roomService.create(room, user.token).then(
                (response) => {
                    setMessage({successful: true, loading: false});
                    navigate(`/rooms/connect/${room.roomName}`);
                },
                (error) => {
                    
                }
            );
        }
    };

    const handleGetRooms = (setRooms, setLoading) => {
        setLoading(true);
        roomService.getRooms().then(
            (response) => {
                setRooms(response);
                setLoading(false);
            },
            (error) => {
                
            }
        );
    };

    const handleGetUserRooms = (currentUser, setRooms, setLoading) => {
        setLoading(true);
        roomService.getUserRooms(currentUser.id, currentUser.token).then(
            (response) => {
                setRooms(response);
                setLoading(false);
            },
            (error) => {
                
            }
        );
    };

    const handleDelete = (room, onDelete) => {
        roomService.delete(room.id, user.token).then(
            (response) => {
                onDelete();
            },
            (error) => {
                
            }
        );
    }

    const handleConnect = (username, room, setError, setMessage) => {
        const usernameError = username.length >= 8 ? false : true;
        const roomError = room.length >= 8 ? false : true;
        setError({username: usernameError, room: roomError});
        if(!usernameError && !roomError) {
            setMessage({loading: true});
            roomService.getId(room).then(
                (response) => {
                    setMessage({successful: true, loading: false});
                    navigate(`/call/${username}/${response}`);
                },
                (error) => {
                    
                }
            );
        }
    };

    const handleInvite = (username, room, setError, setMessage) => {
        const usernameError = username.length >= 8 ? false : true;
        setError({username: usernameError});
        if(!usernameError) {
            setMessage({loading: true});
            roomService.getId(room).then(
                (response) => {
                    setMessage({successful: true, loading: false});
                    navigate(`/call/${username}/${room}`);
                },
                (error) => {
                    
                }
            );
        }
    };

    useEffect(() => {
        handleGetRooms(setSearchRooms, setSearchLoading);
        isLoggedIn && handleGetUserRooms(user, setUserRooms, setUserLoading);
    }, [isLoggedIn, user]);

    return (
        <Routes>
            <Route path="/" element={<SearchView rooms={searchRooms} loading={searchLoading}/>} />
            <Route path="/user" element={
                <PrivateRoute component={SearchView} rooms={userRooms} loading={userLoading} handleDelete={handleDelete}/>
            } />
            <Route path="/create" element={
                <PrivateRoute component={CreateRoomView} handleCreate={handleCreate}/>
            } />
            <Route path="/connect" element={<ConnectView user={user} handleConnect={handleConnect}/>} />
            <Route path="/connect/:room" element={<ConnectView user={user} handleConnect={handleConnect}/>} />
            <Route path="/invite/:room" element={<InviteView user={user} handleConnect={handleInvite}/>} />
        </Routes>
    );
};

export default RoomController;