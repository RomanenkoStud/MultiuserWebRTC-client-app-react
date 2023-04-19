import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserController from "./UserController";
import CallsController from "./CallsController";
import SettingsController from "./SettingsController";
import RoomController from "./RoomController";
import LoginView from "../views/LoginView";
import HomeView from "../views/HomeView";
import InviteView from "../views/InviteView";
import NavBar from "../components/NavBar/NavBar";

function MainRouter() {
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/call/:username/:room" element={<CallsController />} />
                <Route path="/invite/:room" element={<InviteView />} />
                <Route path="/user/*" element={<UserController />} />
                <Route path="/rooms/*" element={<RoomController />} />
                <Route path="/settings/" element={<SettingsController />} />
                <Route path="/login/" element={<LoginView />} />
            </Routes>
        </Router>
    );
}

export default MainRouter;