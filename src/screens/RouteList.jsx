import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CallScreen from "./CallScreen";
import HomeScreen from "./HomeScreen";
import InviteScreen from "./InviteScreen";
import Register from "./Register";
import Login from "./Login";
import ConnectScreen from "./ConnectScreen";
import Settings from "./Settings";
import Profile from "./Profile";
import CreateRoom from "./CreateRoom";
import Search from "./Search";

function PrivateRoute({ component: Component, ...props }) {
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    return isLoggedIn ? <Component {...props} /> : <Navigate to="/login" replace={true} />;
}

function RouteList() {
    return (
        <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/call/:username/:room" element={<CallScreen />} />
            <Route path="/invite/:room" element={<InviteScreen />} />
            <Route path="/register/" element={<Register />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/connect/" element={<ConnectScreen />} />
            <Route path="/settings/" element={<Settings />} />
            <Route path="/profile/" element={<PrivateRoute component={Profile} />} />
            <Route path="/create/" element={<PrivateRoute component={CreateRoom} />} />
            <Route path="/search/" element={<Search />} />
        </Routes>
    );
}

export default RouteList;