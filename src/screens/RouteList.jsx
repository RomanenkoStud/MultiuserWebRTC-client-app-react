import { Routes, Route } from "react-router-dom";
import CallScreen from "./CallScreen";
import HomeScreen from "./HomeScreen";
import InviteScreen from "./InviteScreen";
import Register from "./Register";
import Login from "./Login";
import ConnectScreen from "./ConnectScreen";

function RouteList({currentUser, logIn}) {
    return (
    <Routes>
        <Route path="/" element={<HomeScreen currentUser={currentUser}/>} />
        <Route path="/call/:username/:room" element={<CallScreen currentUser={currentUser}/>} />
        <Route path="/invite/:room" element={<InviteScreen currentUser={currentUser}/>} />
        <Route path="/register/" element={<Register currentUser={currentUser}/>} />
        <Route path="/login/" element={<Login currentUser={currentUser} logIn={logIn}/> } />
        <Route path="/connect/" element={<ConnectScreen currentUser={currentUser}/> } />
    </Routes>
    );
}

export default RouteList;