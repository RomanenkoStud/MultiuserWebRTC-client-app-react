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
    const user = useSelector((state) => state.auth.user);
    const { navigate } = useLogoAnimation();

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

    const handleGetUserRooms = (setRooms, setLoading) => {
        setLoading(true);
        roomService.getUserRooms(user.id, user.token).then(
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
            <Route path="/connect/:room" element={<ConnectView user={user} handleConnect={handleConnect}/>} />
            <Route path="/invite/:room" element={<InviteView user={user} handleConnect={handleConnect}/>} />
        </Routes>
    );
};

export default RoomController;