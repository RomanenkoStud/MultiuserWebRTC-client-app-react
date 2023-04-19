import { Route, Routes, Navigate } from 'react-router-dom';
import CreateRoomView from "../views/CreateRoomView";
import SearchView from "../views/SearchView";
import ConnectView from "../views/ConnectView";
import { useSelector } from "react-redux";

function PrivateRoute({ component: Component, ...props }) {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    return isLoggedIn ? <Component {...props} /> : <Navigate to="/login" replace={true} />;
}

const RoomController = () => {
    const user = useSelector((state) => state.auth.user);
    const handleCreate = () => {};
    const handleSearch = () => {};

    return (
        <Routes>
            <Route path="/" element={<SearchView handleSearch={handleSearch}/>} />
            <Route path="/create" element={
                <PrivateRoute component={CreateRoomView} handleCreate={handleCreate}/>
            } />
            <Route path="/connect" element={<ConnectView user={user}/>} />
        </Routes>
    );
};

export default RoomController;