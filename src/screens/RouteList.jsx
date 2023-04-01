import { Routes, Route } from "react-router-dom";
import CallScreen from "./CallScreen";
import HomeScreen from "./HomeScreen";
import InviteScreen from "./InviteScreen";
import Register from "./Register";
import Login from "./Login";
import ConnectScreen from "./ConnectScreen";
import Settings from "./Settings";

function RouteList() {
    return (
    <Routes>
        <Route path="/" element={<HomeScreen/>} />
        <Route path="/call/:username/:room" element={<CallScreen/>} />
        <Route path="/invite/:room" element={<InviteScreen/>} />
        <Route path="/register/" element={<Register/>} />
        <Route path="/login/" element={<Login/>} />
        <Route path="/connect/" element={<ConnectScreen/>} />
        <Route path="/settings/" element={<Settings/>} />
    </Routes>
    );
}

export default RouteList;