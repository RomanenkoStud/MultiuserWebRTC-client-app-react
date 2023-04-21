import { Route, Routes } from 'react-router-dom';
import CreateRoomView from "../views/CreateRoomView";
import SearchView from "../views/SearchView";
import ConnectView from "../views/ConnectView";
import { useSelector } from "react-redux";
import PrivateRoute from "../components/PrivateRoute";
import InviteView from "../views/InviteView";
import { useLogoAnimation } from "../hooks/useLogoAnimation";


const RoomController = () => {
    const user = useSelector((state) => state.auth.user);
    const { navigate } = useLogoAnimation();

    const handleCreate = () => {};
    const handleSearch = () => {};
    const handleConnect = (username, room, setError, setMessage) => {
        const usernameError = username.length >= 8 ? false : true;
        const roomError = room.length >= 8 ? false : true;
        setError({username: usernameError, room: roomError});
        if(!usernameError && !roomError) {
            navigate(`/call/${username}/${room}`);
        }
    };

    return (
        <Routes>
            <Route path="/" element={<SearchView handleSearch={handleSearch}/>} />
            <Route path="/create" element={
                <PrivateRoute component={CreateRoomView} handleCreate={handleCreate}/>
            } />
            <Route path="/connect/:room" element={<ConnectView user={user} handleConnect={handleConnect}/>} />
            <Route path="/invite/:room" element={<InviteView user={user} handleConnect={handleConnect}/>} />
        </Routes>
    );
};

export default RoomController;