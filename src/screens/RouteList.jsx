import { Routes, Route } from "react-router-dom";
import CallScreen from "./CallScreen";
import HomeScreen from "./HomeScreen";
import InviteScreen from "./InviteScreen";

function RouteList() {
    return (
    <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/call/:username/:room" element={<CallScreen />} />
        <Route path="/invite/:room" element={<InviteScreen />} />
    </Routes>
    );
}

export default RouteList;